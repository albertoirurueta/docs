REPORT zsql_claims.

" tag::helper[]
TYPES ty_claims TYPE STANDARD TABLE OF zexp_claim WITH EMPTY KEY.

CLASS lcl_output DEFINITION.
  PUBLIC SECTION.
    CLASS-METHODS show IMPORTING title TYPE string rows TYPE ty_claims.
ENDCLASS.

CLASS lcl_output IMPLEMENTATION.
  METHOD show.
    WRITE / title.
    LOOP AT rows INTO DATA(row).
      WRITE / |  { row-claim_id } { row-status } { row-amount }|.
    ENDLOOP.
  ENDMETHOD.
ENDCLASS.
" end::helper[]

" tag::seed[]
START-OF-SELECTION.
  INSERT zexp_claim FROM TABLE @( VALUE ty_claims(
    ( claim_id = 'C000000001' status = 'A' amount = 120 )
    ( claim_id = 'C000000002' status = 'S' amount = 35 )
    ( claim_id = 'C000000003' status = 'A' amount = 80 )
    ( claim_id = 'C000000004' status = 'R' amount = 10 )
    ( claim_id = 'C000000005' status = 'S' amount = 64 ) ) ).
  WRITE / |Inserted five rows, sy-subrc = { sy-subrc }|.

  SELECT * FROM zexp_claim INTO TABLE @DATA(all_claims).
  lcl_output=>show( title = `All claims` rows = all_claims ).
" end::seed[]

" tag::where[]
  SELECT * FROM zexp_claim
    WHERE status IN ( 'A', 'S' )
    INTO TABLE @DATA(status_a_or_s).
  lcl_output=>show( title = `Status A or S` rows = status_a_or_s ).

  SELECT * FROM zexp_claim
    WHERE amount BETWEEN 30 AND 100
    INTO TABLE @DATA(mid_range).
  lcl_output=>show( title = `Amount 30 to 100` rows = mid_range ).

  SELECT * FROM zexp_claim
    WHERE claim_id LIKE 'C00000000%' AND status = 'S'
    INTO TABLE @DATA(like_rows).
  lcl_output=>show( title = `Id like C00000000% and status S` rows = like_rows ).
" end::where[]

" tag::order[]
  SELECT * FROM zexp_claim
    ORDER BY amount DESCENDING
    INTO TABLE @DATA(largest_first).
  lcl_output=>show( title = `Largest first` rows = largest_first ).

  SELECT * FROM zexp_claim
    ORDER BY amount DESCENDING
    INTO TABLE @DATA(top_two)
    UP TO 2 ROWS.
  lcl_output=>show( title = `Top two` rows = top_two ).

  SELECT DISTINCT status FROM zexp_claim
    ORDER BY status
    INTO TABLE @DATA(statuses).
  WRITE / |Different statuses: { lines( statuses ) }|.
" end::order[]

" tag::count[]
  SELECT COUNT( * ) FROM zexp_claim INTO @DATA(total).
  WRITE / |Rows in table: { total }|.

  SELECT COUNT( * ) FROM zexp_claim WHERE status = 'S' INTO @DATA(submitted).
  WRITE / |Submitted claims: { submitted }|.
" end::count[]

" tag::single[]
  SELECT SINGLE * FROM zexp_claim WHERE claim_id = 'C000000003' INTO @DATA(claim).
  WRITE / |Found { claim-claim_id } { claim-status } { claim-amount }, subrc { sy-subrc }|.

  SELECT SINGLE * FROM zexp_claim WHERE claim_id = 'C999999999' INTO @claim.
  WRITE / |No row for C999999999, sy-subrc = { sy-subrc }|.
" end::single[]

" tag::insert[]
  INSERT zexp_claim FROM @( VALUE #( claim_id = 'C000000006'
                                     status   = 'S'
                                     amount   = 42 ) ).
  WRITE / |INSERT, sy-subrc = { sy-subrc }|.
" end::insert[]

" tag::update[]
  UPDATE zexp_claim
    SET status = 'A', amount = amount + 5
    WHERE claim_id = 'C000000002'.
  WRITE / |UPDATE, sy-subrc = { sy-subrc }|.

  UPDATE zexp_claim SET status = 'A' WHERE claim_id = 'C999999999'.
  WRITE / |UPDATE without a match, sy-subrc = { sy-subrc }|.
" end::update[]

" tag::modify[]
  MODIFY zexp_claim FROM @( VALUE #( claim_id = 'C000000004'
                                     status   = 'S'
                                     amount   = 10 ) ).
  MODIFY zexp_claim FROM @( VALUE #( claim_id = 'C000000007'
                                     status   = 'R'
                                     amount   = 7 ) ).
  WRITE / |MODIFY twice, sy-subrc = { sy-subrc }|.
" end::modify[]

" tag::delete[]
  DELETE FROM zexp_claim WHERE status = 'R'.
  WRITE / |DELETE, sy-subrc = { sy-subrc }|.

  SELECT * FROM zexp_claim INTO TABLE @DATA(after_changes).
  lcl_output=>show( title = `After the changes` rows = after_changes ).
" end::delete[]
