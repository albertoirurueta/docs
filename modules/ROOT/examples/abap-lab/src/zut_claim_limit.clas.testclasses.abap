CLASS ltcl_limit DEFINITION FINAL FOR TESTING DURATION SHORT RISK LEVEL HARMLESS.
  PRIVATE SECTION.
    DATA cut TYPE REF TO zut_claim_limit.

    METHODS setup.
    METHODS small_amount_is_accepted FOR TESTING.
    METHODS large_amount_is_rejected FOR TESTING.
    METHODS amount_at_limit_is_accepted FOR TESTING.
    METHODS status_text_follows_limit FOR TESTING.
ENDCLASS.

CLASS ltcl_limit IMPLEMENTATION.
  METHOD setup.
    cut = NEW #( ).
  ENDMETHOD.

  METHOD small_amount_is_accepted.
    cl_abap_unit_assert=>assert_true( cut->is_within_limit( 500 ) ).
  ENDMETHOD.

  METHOD large_amount_is_rejected.
    cl_abap_unit_assert=>assert_false( cut->is_within_limit( 1500 ) ).
  ENDMETHOD.

  METHOD amount_at_limit_is_accepted.
    cl_abap_unit_assert=>assert_true(
      act = cut->is_within_limit( zut_claim_limit=>c_limit )
      msg = `A claim of exactly the limit must be accepted` ).
  ENDMETHOD.

  METHOD status_text_follows_limit.
    cl_abap_unit_assert=>assert_equals(
      act = cut->status_for( 500 )
      exp = `Approved` ).
    cl_abap_unit_assert=>assert_equals(
      act = cut->status_for( 1500 )
      exp = `Rejected` ).
  ENDMETHOD.
ENDCLASS.
