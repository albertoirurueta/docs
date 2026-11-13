CLASS ltcl_greeter DEFINITION FINAL FOR TESTING DURATION SHORT RISK LEVEL HARMLESS.
  PRIVATE SECTION.
    METHODS greets_by_name FOR TESTING.
ENDCLASS.

CLASS ltcl_greeter IMPLEMENTATION.
  METHOD greets_by_name.
    DATA(cut) = NEW zcl_greeter( ).
    cl_abap_unit_assert=>assert_equals( act = cut->greet( `World` ) exp = `Hello, World!` ).
  ENDMETHOD.
ENDCLASS.
