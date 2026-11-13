INTERFACE zoo_if_payout PUBLIC.
  METHODS get_name
    RETURNING VALUE(name) TYPE string.
  METHODS calculate
    IMPORTING claimed       TYPE i
    RETURNING VALUE(payout) TYPE i.
ENDINTERFACE.
