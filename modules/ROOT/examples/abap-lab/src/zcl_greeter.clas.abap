CLASS zcl_greeter DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    METHODS greet
      IMPORTING name          TYPE string
      RETURNING VALUE(result) TYPE string.
ENDCLASS.

CLASS zcl_greeter IMPLEMENTATION.
  METHOD greet.
    result = |Hello, { name }!|.
  ENDMETHOD.
ENDCLASS.
