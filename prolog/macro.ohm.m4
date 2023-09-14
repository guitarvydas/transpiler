JSMacro {
  stuff = char+
  char =
    | applySyntactic<Macro>
    | any

  Macro =
    | "mutate" vcomma "(" Actual argComma Actual argComma ")" ";" -- assign

  Actual = actualChar+
  actualChar = ~argComma any
  argComma = "†"
  vcomma = "ₓ"
}
