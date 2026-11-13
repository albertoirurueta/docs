CLASS zut_claim_limit DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    CONSTANTS c_limit TYPE i VALUE 1000.

    METHODS is_within_limit
      IMPORTING amount        TYPE i
      RETURNING VALUE(result) TYPE abap_bool.

    METHODS status_for
      IMPORTING amount        TYPE i
      RETURNING VALUE(result) TYPE string.
ENDCLASS.

CLASS zut_claim_limit IMPLEMENTATION.
  METHOD is_within_limit.
    result = xsdbool( amount <= c_limit ).
  ENDMETHOD.

  METHOD status_for.
    IF is_within_limit( amount ) = abap_true.
      result = `Approved`.
    ELSE.
      result = `Rejected`.
    ENDIF.
  ENDMETHOD.
ENDCLASS.
