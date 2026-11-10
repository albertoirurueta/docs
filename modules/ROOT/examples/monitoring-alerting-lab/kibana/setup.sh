#!/usr/bin/env bash
# Creates the Kibana objects of the Bookshelf lab in the space "bookshelf": space, data views, webhook connector,
# the five alert rules, an availability SLO, a maintenance window and the dashboard.
# Run it once, after Kibana is ready and the load generator has produced some data. Needs curl and jq.
set -euo pipefail
cd "$(dirname "$0")"

export ELASTIC_PASSWORD="${ELASTIC_PASSWORD:-lab-elastic-password}"
export KIBANA_URL="${KIBANA_URL:-http://localhost:5601}"
export KIBANA="$KIBANA_URL/s/bookshelf"
export KAUTH="elastic:$ELASTIC_PASSWORD"
api() { curl -sS -u "$KAUTH" -H 'kbn-xsrf: true' -H 'Content-Type: application/json' "$@"; }

echo "== space"
api -X POST "$KIBANA_URL/api/spaces/space" -d '{
  "id": "bookshelf", "name": "Bookshelf",
  "description": "Bookshelf service dashboards, rules and connectors", "solution": "oblt"
}' | jq -c '{id, solution}'

echo "== data views"
api -X POST "$KIBANA/api/data_views/data_view" -d '{"data_view":{"id":"bookshelf-traces","name":"Bookshelf traces","title":"traces-*","timeFieldName":"@timestamp"}}' | jq -c '.data_view.id'
api -X POST "$KIBANA/api/data_views/data_view" -d '{"data_view":{"id":"bookshelf-logs","name":"Bookshelf logs (OTel)","title":"logs-*.otel-*","timeFieldName":"@timestamp"}}' | jq -c '.data_view.id'

echo "== connector"
api -X POST "$KIBANA/api/actions/connector/bookshelf-webhook" -d '{
  "name": "bookshelf-webhook",
  "connector_type_id": ".webhook",
  "config": {
    "url": "http://webhook-receiver:8080/kibana",
    "method": "post",
    "hasAuth": false,
    "headers": { "Content-Type": "application/json" }
  }
}' | jq -c '{id, is_missing_secrets}'

echo "== helpers that read the action group ids of the rule types"
types() { curl -s -u elastic:"$ELASTIC_PASSWORD" "$KIBANA_URL/s/bookshelf/api/alerting/rule_types"; }
default_group() { types | jq -r --arg t "$1" '.[] | select(.id == $t) | .default_action_group_id'; }
group_named()   { types | jq -r --arg t "$1" --arg n "$2" '.[] | select(.id == $t) | .action_groups[] | select(.name | ascii_downcase == $n) | .id'; }

echo "== rule: high 5xx ratio"
CT=observability.rules.custom_threshold
curl -s -u elastic:"$ELASTIC_PASSWORD" -X POST "$KIBANA_URL/s/bookshelf/api/alerting/rule/bookshelf-5xx-ratio" \
  -H 'kbn-xsrf: true' -H 'Content-Type: application/json' -d @- <<JSON
{
  "name": "Bookshelf high 5xx ratio",
  "rule_type_id": "$CT",
  "consumer": "alerts",
  "tags": ["bookshelf", "bookshelf-sre"],
  "schedule": { "interval": "1m" },
  "params": {
    "criteria": [
      {
        "aggType": "custom",
        "comparator": ">",
        "threshold": [0.05],
        "timeSize": 5,
        "timeUnit": "m",
        "equation": "A / B",
        "label": "5xx ratio",
        "metrics": [
          { "name": "A", "aggType": "count", "filter": "service.name: \"bookshelf\" and http.response.status_code >= 500" },
          { "name": "B", "aggType": "count", "filter": "service.name: \"bookshelf\"" }
        ]
      }
    ],
    "searchConfiguration": { "index": "bookshelf-traces", "query": { "language": "kuery", "query": "" } },
    "alertOnNoData": false,
    "alertOnGroupDisappear": false
  },
  "actions": [
    {
      "id": "bookshelf-webhook",
      "group": "$(group_named $CT alert)",
      "frequency": { "summary": false, "notify_when": "onActionGroupChange", "throttle": null },
      "params": { "body": "{\"rule\":\"{{rule.name}}\",\"reason\":\"{{context.reason}}\",\"url\":\"{{context.viewInAppUrl}}\"}" }
    }
  ]
}
JSON
echo

echo "== rule: p95 latency above SLO"
APM=apm.transaction_duration
curl -s -u elastic:"$ELASTIC_PASSWORD" -X POST "$KIBANA_URL/s/bookshelf/api/alerting/rule/bookshelf-p95-latency" \
  -H 'kbn-xsrf: true' -H 'Content-Type: application/json' -d @- <<JSON
{
  "name": "Bookshelf p95 latency above SLO",
  "rule_type_id": "$APM",
  "consumer": "apm",
  "tags": ["bookshelf", "bookshelf-sre"],
  "schedule": { "interval": "1m" },
  "params": {
    "serviceName": "bookshelf",
    "transactionType": "request",
    "environment": "lab",
    "aggregationType": "95th",
    "threshold": 500,
    "windowSize": 5,
    "windowUnit": "m",
    "groupBy": ["service.name", "service.environment"]
  },
  "actions": [
    {
      "id": "bookshelf-webhook",
      "group": "$(default_group $APM)",
      "frequency": { "summary": false, "notify_when": "onActionGroupChange", "throttle": null },
      "params": { "body": "{\"rule\":\"{{rule.name}}\",\"service\":\"{{context.serviceName}}\",\"value\":\"{{context.triggerValue}}\",\"threshold\":\"{{context.threshold}}\"}" }
    }
  ]
}
JSON
echo

echo "== rule: no data"
curl -s -u elastic:"$ELASTIC_PASSWORD" -X POST "$KIBANA_URL/s/bookshelf/api/alerting/rule/bookshelf-no-data" \
  -H 'kbn-xsrf: true' -H 'Content-Type: application/json' -d @- <<JSON
{
  "name": "Bookshelf no data",
  "rule_type_id": "$CT",
  "consumer": "alerts",
  "tags": ["bookshelf", "bookshelf-sre"],
  "schedule": { "interval": "1m" },
  "params": {
    "criteria": [
      {
        "aggType": "custom",
        "comparator": "<",
        "threshold": [1],
        "timeSize": 5,
        "timeUnit": "m",
        "equation": "A",
        "label": "requests",
        "metrics": [ { "name": "A", "aggType": "count", "filter": "service.name: \"bookshelf\"" } ]
      }
    ],
    "searchConfiguration": { "index": "bookshelf-traces", "query": { "language": "kuery", "query": "" } },
    "noDataBehavior": "alertOnNoData"
  },
  "actions": [
    {
      "id": "bookshelf-webhook",
      "group": "$(group_named $CT 'no data')",
      "frequency": { "summary": false, "notify_when": "onActionGroupChange", "throttle": null },
      "params": { "body": "{\"rule\":\"{{rule.name}}\",\"reason\":\"{{context.reason}}\"}" }
    },
    {
      "id": "bookshelf-webhook",
      "group": "$(group_named $CT alert)",
      "frequency": { "summary": false, "notify_when": "onActionGroupChange", "throttle": null },
      "params": { "body": "{\"rule\":\"{{rule.name}}\",\"reason\":\"{{context.reason}}\"}" }
    }
  ]
}
JSON
echo

echo "== rule: error-log spike"
curl -s -u elastic:"$ELASTIC_PASSWORD" -X POST "$KIBANA_URL/s/bookshelf/api/alerting/rule/bookshelf-error-log-spike" \
  -H 'kbn-xsrf: true' -H 'Content-Type: application/json' -d '{
    "name": "Bookshelf error-log spike",
    "rule_type_id": ".es-query",
    "consumer": "stackAlerts",
    "tags": ["bookshelf", "bookshelf-sre"],
    "schedule": { "interval": "1m" },
    "params": {
      "searchType": "searchSource",
      "searchConfiguration": {
        "index": "bookshelf-logs",
        "query": { "language": "kuery", "query": "severity_text: \"ERROR\"" }
      },
      "aggType": "count",
      "groupBy": "all",
      "excludeHitsFromPreviousRun": false,
      "size": 10,
      "threshold": [20],
      "thresholdComparator": ">",
      "timeWindowSize": 5,
      "timeWindowUnit": "m"
    },
    "actions": [
      {
        "id": "bookshelf-webhook",
        "group": "query matched",
        "frequency": { "summary": false, "notify_when": "onActionGroupChange", "throttle": null },
        "params": {
          "body": "{\"rule\":\"{{rule.name}}\",\"value\":\"{{context.value}}\",\"conditions\":\"{{context.conditions}}\",\"link\":\"{{context.link}}\"}"
        }
      }
    ]
  }'
echo

echo "== SLO and its burn rate rule"
api -X POST "$KIBANA/api/observability/slos" -d '{
  "id": "bookshelf-availability",
  "name": "Bookshelf availability",
  "description": "99.5 percent of requests succeed over 30 days",
  "indicator": {
    "type": "sli.kql.custom",
    "params": {
      "index": "traces-*",
      "timestampField": "@timestamp",
      "filter": "service.name : \"bookshelf\"",
      "good": "http.response.status_code < 500",
      "total": "http.response.status_code : *"
    }
  },
  "timeWindow": { "duration": "30d", "type": "rolling" },
  "budgetingMethod": "occurrences",
  "objective": { "target": 0.995 },
  "tags": ["bookshelf", "lab"]
}'
echo
api -X POST "$KIBANA/api/alerting/rule/bookshelf-slo-burn-rate" -d '{
  "name": "Bookshelf availability burn rate",
  "rule_type_id": "slo.rules.burnRate",
  "consumer": "slo",
  "schedule": { "interval": "1m" },
  "tags": ["bookshelf", "lab"],
  "params": {
    "sloId": "bookshelf-availability",
    "windows": [
      { "id": "w-1h",  "burnRateThreshold": 14.4, "longWindow": { "value": 1,  "unit": "h" }, "shortWindow": { "value": 5,   "unit": "m" }, "actionGroup": "slo.burnRate.alert" },
      { "id": "w-6h",  "burnRateThreshold": 6,    "longWindow": { "value": 6,  "unit": "h" }, "shortWindow": { "value": 30,  "unit": "m" }, "actionGroup": "slo.burnRate.high" },
      { "id": "w-24h", "burnRateThreshold": 3,    "longWindow": { "value": 24, "unit": "h" }, "shortWindow": { "value": 2,   "unit": "h" }, "actionGroup": "slo.burnRate.medium" },
      { "id": "w-72h", "burnRateThreshold": 1,    "longWindow": { "value": 72, "unit": "h" }, "shortWindow": { "value": 6,   "unit": "h" }, "actionGroup": "slo.burnRate.low" }
    ]
  },
  "actions": [
    {
      "id": "bookshelf-webhook", "group": "slo.burnRate.alert",
      "frequency": { "notify_when": "onActionGroupChange", "summary": false },
      "params": { "body": "{\"rule\":\"{{rule.name}}\",\"status\":\"critical burn\",\"reason\":\"{{context.reason}}\",\"link\":\"{{context.alertDetailsUrl}}\"}" }
    },
    {
      "id": "bookshelf-webhook", "group": "slo.burnRate.high",
      "frequency": { "notify_when": "onActionGroupChange", "summary": false },
      "params": { "body": "{\"rule\":\"{{rule.name}}\",\"status\":\"high burn\",\"reason\":\"{{context.reason}}\"}" }
    },
    {
      "id": "bookshelf-webhook", "group": "recovered",
      "frequency": { "notify_when": "onActionGroupChange", "summary": false },
      "params": { "body": "{\"rule\":\"{{rule.name}}\",\"status\":\"recovered\"}" }
    }
  ]
}'
echo

echo "== maintenance window"
api -X POST "$KIBANA/api/maintenance_window" -d '{
  "title": "Bookshelf weekly deploy",
  "enabled": true,
  "schedule": {
    "custom": {
      "start": "2026-11-15T22:00:00.000Z",
      "duration": "1h",
      "timezone": "UTC",
      "recurring": { "every": "1w", "onWeekDay": ["SU"] }
    }
  },
  "scope": { "alerting": { "query": { "kql": "kibana.alert.rule.tags : \"bookshelf\"" } } }
}'
echo

echo "== dashboard"
api -X PUT "$KIBANA/api/dashboards/bookshelf-service-health" -d @bookshelf-service-health.json | jq -c '{id}'
