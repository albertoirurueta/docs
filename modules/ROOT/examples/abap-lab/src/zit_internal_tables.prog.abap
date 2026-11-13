REPORT zit_internal_tables.

START-OF-SELECTION.
  DATA(claim_items) = NEW zit_claim_items( ).
  DATA(items) = claim_items->build( ).
  WRITE / |Claim 1001 has { lines( items ) } items|.
  " tag::call-read[]
  claim_items->read_rows( items ).
  " end::call-read[]
  " tag::call-group[]
  claim_items->list_by_category( items ).
  " end::call-group[]
  " tag::call-total[]
  claim_items->total_and_filter( items ).
  " end::call-total[]
