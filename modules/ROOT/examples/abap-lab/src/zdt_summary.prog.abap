REPORT zdt_summary.

START-OF-SELECTION.
  " tag::declare[]
  DATA claim_id TYPE string VALUE `C-1001`.
  DATA employee TYPE c LENGTH 20 VALUE 'Ada Lovelace'.
  DATA short_name TYPE c LENGTH 5.
  DATA(item_count) = 3.

  short_name = employee.
  WRITE / |{ claim_id }: { strlen( claim_id ) } characters|.
  WRITE / |{ employee }: { strlen( employee ) } characters|.
  WRITE / |{ short_name }: { strlen( short_name ) } characters|.
  WRITE / |{ item_count } items|.
  " end::declare[]

  " tag::convert[]
  DATA(share) = 7 / 2.
  DATA(exact_share) = CONV decfloat34( 7 ) / 2.
  DATA(units) = CONV i( '42' ) + 1.
  WRITE / |Integer division: { share }|.
  WRITE / |With CONV: { exact_share }|.
  WRITE / |Text to number plus 1: { units }|.
  " end::convert[]

  " tag::template[]
  DATA(currency) = `EUR`.
  DATA(amount) = CONV decfloat34( '125.5' ).
  DATA(line) = |Claim { claim_id } for { employee }: { amount } { currency }|.
  WRITE / line.
  WRITE / |{ item_count } items, { item_count * 10 } { currency } pending|.
  WRITE / |Two decimals: { amount DECIMALS = 2 }|.
  WRITE / |No decimals: { amount DECIMALS = 0 }|.
  " end::template[]

  " tag::functions[]
  DATA(raw_name) = `   ada    lovelace   `.
  DATA(clean_name) = to_upper( condense( raw_name ) ).
  WRITE / |{ strlen( raw_name ) } characters before, { strlen( clean_name ) } after: { clean_name }|.
  WRITE / |Number part: { substring( val = claim_id off = 2 len = 4 ) }|.
  WRITE / |Before the dash: { substring_before( val = claim_id sub = `-` ) }|.
  WRITE / |Position of the dash: { find( val = claim_id sub = `-` ) }|.
  WRITE / |Replaced: { replace( val = claim_id sub = `C-` with = `CLAIM-` ) }|.
  " end::functions[]

  " tag::split[]
  DATA(raw_line) = `C-1001; ada  lovelace ;125.5;eur`.
  DATA parts TYPE STANDARD TABLE OF string WITH EMPTY KEY.
  SPLIT raw_line AT ';' INTO TABLE parts.
  WRITE / |{ lines( parts ) } parts|.
  LOOP AT parts INTO DATA(part).
    WRITE / |[{ part }]|.
  ENDLOOP.
  " end::split[]

  " tag::regex[]
  IF matches( val = claim_id pcre = `C-\d{4}` ).
    WRITE / |{ claim_id } is a claim number|.
  ENDIF.
  IF NOT matches( val = `C-12` pcre = `C-\d{4}` ).
    WRITE / |C-12 is not a claim number|.
  ENDIF.

  DATA(note) = `Taxi 12.50 and hotel 80.00`.
  FIND PCRE `(\w+)\s+(\d+\.\d\d)` IN note SUBMATCHES DATA(item) DATA(price).
  WRITE / |First item: { item } costs { price }|.
  WRITE / replace( val = note pcre = `\d+\.\d\d` with = `<amount>` occ = 0 ).
  " end::regex[]

  " tag::class[]
  WRITE / zdt_claim_text=>summary_line( raw_line ).
  WRITE / zdt_claim_text=>summary_line( `X-1; ada lovelace;10;eur` ).
  WRITE / zdt_claim_text=>summary_line( `C-1002;Ben` ).
  " end::class[]
