REPORT zoo_claims_report.

START-OF-SELECTION.
  " Two strategies, one kind of reference: the same call, different results.
  DATA strategies TYPE STANDARD TABLE OF REF TO zoo_if_payout WITH EMPTY KEY.
  APPEND NEW zoo_cl_full_payout( ) TO strategies.
  APPEND NEW zoo_cl_capped_payout( cap = 300 ) TO strategies.

  LOOP AT strategies INTO DATA(strategy).
    WRITE / |{ strategy->get_name( ) } pays { strategy->calculate( 350 ) } of 350|.
  ENDLOOP.

  " A rejected claim ends the block early and the handler prints the reason.
  DATA(validator) = NEW zoo_cl_claim_validator( max_amount = 500 ).
  TRY.
      validator->validate( claim_id = 1001 amount = 45 ).
      WRITE / 'Claim 1001 is valid'.
      validator->validate( claim_id = 1002 amount = 900 ).
      WRITE / 'Claim 1002 is valid'.
    CATCH zoo_cx_claim_invalid INTO DATA(error).
      WRITE / error->get_text( ).
  ENDTRY.

  " Through the object, the call needs its full name, prefix included.
  DATA(full) = NEW zoo_cl_full_payout( ).
  WRITE / |Direct call: { full->zoo_if_payout~calculate( 100 ) }|.
