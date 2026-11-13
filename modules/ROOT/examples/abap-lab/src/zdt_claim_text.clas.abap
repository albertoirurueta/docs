CLASS zdt_claim_text DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    CLASS-METHODS summary_line
      IMPORTING raw         TYPE string
      RETURNING VALUE(line) TYPE string.
ENDCLASS.

CLASS zdt_claim_text IMPLEMENTATION.
  METHOD summary_line.
    DATA parts TYPE STANDARD TABLE OF string WITH EMPTY KEY.
    SPLIT raw AT ';' INTO TABLE parts.
    IF lines( parts ) <> 4.
      line = |Cannot read: { raw }|.
      RETURN.
    ENDIF.

    DATA(id) = condense( parts[ 1 ] ).
    IF NOT matches( val = id pcre = `C-\d{4}` ).
      line = |Not a claim number: { id }|.
      RETURN.
    ENDIF.

    DATA(name) = to_upper( condense( parts[ 2 ] ) ).
    DATA(amount) = CONV decfloat34( condense( parts[ 3 ] ) ).
    DATA(currency) = to_upper( condense( parts[ 4 ] ) ).
    line = |Claim { id } \| { name } \| { amount DECIMALS = 2 } { currency }|.
  ENDMETHOD.
ENDCLASS.
