// templates.js - Meisterprüfung Formelvorlagen für verschiedene Gewerke

const PRESET_TEMPLATES = {
  elektro: {
    title: "Formelsammlung: Elektrotechnik Meisterprüfung",
    subtitle: "Fachtheorie Teil II: Grundgrößen, Wechselstrom & Drehstrom",
    author: "Meisteranwärter Elektrotechnik",
    theme: "theme-navy",
    columns: "cols-2",
    cards: [
      {
        id: "c-1",
        type: "formula",
        title: "Ohm'sches Gesetz",
        tag: "Grundlagen",
        mainFormula: "R = \\frac{U}{I}",
        derivedFormula: "U = R \\cdot I \\quad \\Leftrightarrow \\quad I = \\frac{U}{R}",
        variables: "U: Spannung [\\text{V}]\nI: Stromstärke [\\text{A}]\nR: Widerstand [\\Omega]",
        example: "Gegeben: U = 230\\text{ V}, I = 5\\text{ A}\nR = \\frac{230\\text{ V}}{5\\text{ A}} = 46\\,\\Omega",
        tip: "Achtung: Gilt rein linear bei temperaturunabhängigen ohmschen Leitern."
      },
      {
        id: "c-2",
        type: "formula",
        title: "Elektrische Leistung (Gleichstrom / Wirkleistung)",
        tag: "Leistung",
        mainFormula: "P = U \\cdot I",
        derivedFormula: "P = I^2 \\cdot R = \\frac{U^2}{R}",
        variables: "P: Leistung [\\text{W}]\nU: Spannung [\\text{V}]\nI: Stromstärke [\\text{A}]\nR: Widerstand [\\Omega]",
        example: "P = 230\\text{ V} \\cdot 16\\text{ A} = 3680\\text{ W} = 3{,}68\\text{ kW}",
        tip: "Bei Wechselstrom ist dies die Wirkleistung P bei rein ohmscher Last (\\cos\\varphi = 1)."
      },
      {
        id: "c-3",
        type: "formula",
        title: "Drehstrom-Leistung (Dreiphasen-Wechselstrom)",
        tag: "Drehstrom",
        mainFormula: "P = \\sqrt{3} \\cdot U \\cdot I \\cdot \\cos\\varphi",
        derivedFormula: "S = \\sqrt{3} \\cdot U \\cdot I \\quad (\\text{Scheinleistung [VA]})\nQ = \\sqrt{3} \\cdot U \\cdot I \\cdot \\sin\\varphi \\quad (\\text{Blindleistung [var]})",
        variables: "U: Leiterspannung (\\text{z. B. } 400\\text{ V})\nI: Leiterstrom [\\text{A}]\n\\cos\\varphi: Wirkfaktor",
        example: "U = 400\\text{ V}, I = 10\\text{ A}, \\cos\\varphi = 0{,}85\nP = 1{,}732 \\cdot 400\\text{ V} \\cdot 10\\text{ A} \\cdot 0{,}85 = 5889\\text{ W} \\approx 5{,}89\\text{ kW}",
        tip: "Häufiger Prüfungsfehler: U ist die Außenleiterspannung (400 V), nicht 230 V!"
      },
      {
        id: "c-4",
        type: "formula",
        title: "Leiterwiderstand & Spannungsfall",
        tag: "Leitungsberechnung",
        mainFormula: "R = \\frac{\\rho \\cdot l}{A} = \\frac{l}{\\gamma \\cdot A}",
        derivedFormula: "\\Delta U = \\frac{2 \\cdot l \\cdot I \\cdot \\cos\\varphi}{\\gamma \\cdot A} \\quad (\\text{Einphasen-Wechselstrom})",
        variables: "l: Leitungslänge [\\text{m}]\nA: Querschnitt [\\text{mm}^2]\n\\rho: Spez. Widerstand (\\text{Kupfer: } 0{,}0178\\,\\frac{\\Omega \\cdot \\text{mm}^2}{\\text{m}})\n\\gamma: Leitfähigkeit (\\text{Kupfer: } 56\\,\\frac{\\text{m}}{\\Omega \\cdot \\text{mm}^2})",
        example: "Kupfer, l = 25\\text{ m}, A = 2{,}5\\text{ mm}^2\nR = \\frac{25}{56 \\cdot 2{,}5} = 0{,}179\\,\\Omega",
        tip: "Faktor 2 bei Einphasen-Wechselstrom für Hin- und Rückleiter nicht vergessen!"
      },
      {
        id: "c-5",
        type: "formula",
        title: "Blindwiderstände (Induktiv & Kapazitiv)",
        tag: "Wechselstrom",
        mainFormula: "X_L = 2\\pi \\cdot f \\cdot L \\quad \\text{und} \\quad X_C = \\frac{1}{2\\pi \\cdot f \\cdot C}",
        derivedFormula: "Z = \\sqrt{R^2 + (X_L - X_C)^2} \\quad (\\text{Gesamtimpedanz})",
        variables: "f: Netzfrequenz (50\\text{ Hz})\nL: Induktivität [\\text{H}]\nC: Kapazität [\\text{F}]\nZ: Scheinwiderstand [\\Omega]",
        example: "f = 50\\text{ Hz}, L = 0{,}15\\text{ H}\nX_L = 2\\pi \\cdot 50 \\cdot 0{,}15 = 47{,}12\\,\\Omega",
        tip: "Resonanzfall: X_L = X_C (Reihenschwingkreis hat minimale Impedanz Z = R)."
      },
      {
        id: "c-6",
        type: "note",
        title: "Meisterprüfung Checkliste: Elektrische Prüfungen (VDE 0100-600)",
        content: "1. **Besichtigen:** Richtige Auswahl der Betriebsmittel, Kennzeichnung, Schutzleiter.\n2. **Erproben & Messen:**\n  • Durchgängigkeit der Schutzleiter (R_{PE} \\le 0{,}3\\,\\Omega)\n  • Isolationswiderstand (R_{ISO} \\ge 1{,}0\\,\\text{M}\\Omega bei 500 V DC)\n  • Schleifenimpedanz Z_S zur Abschaltzeit-Überprüfung\n  • RCD-Prüfung: Auslösezeit t_A und Auslösestrom I_{\\Delta N}"
      }
    ]
  },

  metall: {
    title: "Formelsammlung: Feinwerk- & Metallbaumeister",
    subtitle: "Fachtheorie Teil II: Zerspanung, Statik & Maschinenelemente",
    author: "Meisteranwärter Metalltechnik",
    theme: "theme-blue",
    columns: "cols-2",
    cards: [
      {
        id: "m-1",
        type: "formula",
        title: "Schnittgeschwindigkeit (Drehen / Fräsen)",
        tag: "Zerspanung",
        mainFormula: "v_c = \\frac{\\pi \\cdot d \\cdot n}{1000}",
        derivedFormula: "n = \\frac{v_c \\cdot 1000}{\\pi \\cdot d}",
        variables: "v_c: Schnittgeschwindigkeit [\\frac{\\text{m}}{\\text{min}}]\nd: Werkstück-/Fräserdurchmesser [\\text{mm}]\nn: Drehzahl [\\frac{1}{\\text{min}}]",
        example: "Gegeben: d = 50\\text{ mm}, v_c = 120\\,\\frac{\\text{m}}{\\text{min}}\nn = \\frac{120 \\cdot 1000}{3{,}1416 \\cdot 50} \\approx 764\\,\\frac{1}{\\text{min}}",
        tip: "Der Faktor 1000 rechnet Millimeter [mm] in Meter [m] um!"
      },
      {
        id: "m-2",
        type: "formula",
        title: "Vorschubgeschwindigkeit & Zeitspanvolumen",
        tag: "Zerspanung",
        mainFormula: "v_f = n \\cdot f_z \\cdot z",
        derivedFormula: "Q = \\frac{a_p \\cdot a_e \\cdot v_f}{1000} \\quad [\\frac{\\text{cm}^3}{\\text{min}}]",
        variables: "v_f: Vorschubgeschwindigkeit [\\frac{\\text{mm}}{\\text{min}}]\nf_z: Zahnvorschub [\\text{mm}]\nz: Zähnezahl des Fräsers\na_p: Schnitttiefe [\\text{mm}], a_e: Schnittbreite [\\text{mm}]",
        example: "n = 1200\\,\\text{min}^{-1}, z = 4, f_z = 0{,}08\\text{ mm}\nv_f = 1200 \\cdot 0{,}08 \\cdot 4 = 384\\,\\frac{\\text{mm}}{\\text{min}}",
        tip: "Beim Drehen gilt vereinfacht v_f = n \\cdot f (mit Umdrehungsvorschub f)."
      },
      {
        id: "m-3",
        type: "formula",
        title: "Mechanische Spannung (Zug / Druck)",
        tag: "Festigkeitslehre",
        mainFormula: "\\sigma = \\frac{F}{S} \\le \\sigma_{zul}",
        derivedFormula: "\\sigma_{zul} = \\frac{R_e}{\\nu} \\quad \\text{bzw.} \\quad \\sigma_{zul} = \\frac{R_m}{\\nu}",
        variables: "\\sigma: Spannung [\\frac{\\text{N}}{\\text{mm}^2} = \\text{MPa}]\nF: Kraft [\\text{N}]\nS: Querschnittsfläche [\\text{mm}^2]\n\\nu: Sicherheitsbeiwert (\\text{meist } 1{,}5 \\text{ bis } 3)",
        example: "F = 15000\\text{ N}, S = 100\\text{ mm}^2\n\\sigma = \\frac{15000\\text{ N}}{100\\text{ mm}^2} = 150\\,\\frac{\\text{N}}{\\text{mm}^2}",
        tip: "Für Kreisquerschnitt: S = \\frac{\\pi \\cdot d^2}{4}."
      },
      {
        id: "m-4",
        type: "formula",
        title: "Drehmoment & Antriebsleistung",
        tag: "Maschinenelemente",
        mainFormula: "M = F \\cdot r = \\frac{P}{\\omega}",
        derivedFormula: "P = \\frac{M \\cdot n}{9550} \\quad [P \\text{ in kW}, M \\text{ in Nm}, n \\text{ in min}^{-1}]",
        variables: "M: Drehmoment [\\text{Nm}]\nF: Umfangskraft [\\text{N}]\nr: Hebelarm [\\text{m}]\nP: Mechanische Leistung [\\text{kW}]\nn: Drehzahl [\\frac{1}{\\text{min}}]",
        example: "M = 120\\text{ Nm}, n = 1500\\,\\text{min}^{-1}\nP = \\frac{120 \\cdot 1500}{9550} = 18{,}85\\,\\text{kW}",
        tip: "Die Zahl 9550 ist die bewährte Meister-Praxisformel (abgeleitet aus \\frac{60 \\cdot 1000}{2\\pi})."
      }
    ]
  },

  shk: {
    title: "Formelsammlung: SHK-Meisterprüfung",
    subtitle: "Installateur- und Heizungsbauermeister · Wärmelehre & Hydraulik",
    author: "Meisteranwärter SHK",
    theme: "theme-emerald",
    columns: "cols-2",
    cards: [
      {
        id: "s-1",
        type: "formula",
        title: "Wärmemenge (Kalorische Grundgleichung)",
        tag: "Wärmelehre",
        mainFormula: "Q = m \\cdot c \\cdot \\Delta T",
        derivedFormula: "m = \\frac{Q}{c \\cdot \\Delta T} \\quad \\Leftrightarrow \\quad \\Delta T = \\frac{Q}{m \\cdot c}",
        variables: "Q: Wärmemenge [\\text{kJ} \\text{ oder } \\text{kWh}]\nm: Masse des Wassers [\\text{kg}]\nc: Spez. Wärmekapazität (Wasser: 4{,}186\\,\\frac{\\text{kJ}}{\\text{kg} \\cdot \\text{K}} = 1{,}163\\,\\frac{\\text{Wh}}{\\text{kg} \\cdot \\text{K}})\n\\Delta T: Temperaturdifferenz [\\text{K}]",
        example: "Speicher m = 300\\text{ kg}, Erwärmung von 10^{\\circ}\\text{C auf } 60^{\\circ}\\text{C (}\\Delta T = 50\\text{ K})\nQ = 300 \\cdot 1{,}163 \\cdot 50 = 17445\\text{ Wh} = 17{,}45\\text{ kWh}",
        tip: "1 kWh = 3600 kJ. Prüfe immer, in welcher Einheit die Aufgabe das Ergebnis verlangt!"
      },
      {
        id: "s-2",
        type: "formula",
        title: "Heizwasser-Volumenstrom (Massenstrom)",
        tag: "Hydraulik",
        mainFormula: "\\dot{V} = \\frac{\\dot{Q}}{c \\cdot \\rho \\cdot \\Delta \\vartheta}",
        derivedFormula: "\\dot{V} \\approx \\frac{\\dot{Q}}{1{,}163 \\cdot \\Delta \\vartheta} \\quad [\\dot{V} \\text{ in } \\frac{\\text{l}}{\\text{h}}, \\dot{Q} \\text{ in } \\text{W}, \\Delta \\vartheta \\text{ in } \\text{K}]",
        variables: "\\dot{Q}: Heizlast / Wärmeleistung [\\text{W}]\n\\dot{V}: Volumenstrom [\\frac{\\text{l}}{\\text{h}} \\text{ bzw. } \\frac{\\text{m}^3}{\\text{h}}]\n\\Delta \\vartheta: Spreizung zwischen Vor- und Rücklauf [\\text{K}]\n\\rho: Dichte Wasser (\\approx 1\\,\\frac{\\text{kg}}{\\text{l}})",
        example: "\\dot{Q} = 12000\\text{ W} (12\\text{ kW}), Vorlauf 55^{\\circ}\\text{C}, Rücklauf 45^{\\circ}\\text{C (}\\Delta \\vartheta = 10\\text{ K})\n\\dot{V} = \\frac{12000}{1{,}163 \\cdot 10} \\approx 1032\\,\\frac{\\text{l}}{\\text{h}} = 1{,}03\\,\\frac{\\text{m}^3}{\\text{h}}",
        tip: "Bei Fußbodenheizung geringere Spreizung (meist 5–7 K) -> größerer Volumenstrom!"
      },
      {
        id: "s-3",
        type: "formula",
        title: "Strömungsgeschwindigkeit im Rohr",
        tag: "Hydraulik",
        mainFormula: "w = \\frac{\\dot{V}}{A} = \\frac{4 \\cdot \\dot{V}}{\\pi \\cdot d_i^2}",
        derivedFormula: "d_i = \\sqrt{\\frac{4 \\cdot \\dot{V}}{\\pi \\cdot w}}",
        variables: "w: Strömungsgeschwindigkeit [\\frac{\\text{m}}{\\text{s}}]\n\\dot{V}: Volumenstrom [\\frac{\\text{m}^3}{\\text{s}}]\nd_i: Rohr-Innendurchmesser [\\text{m}]",
        example: "\\dot{V} = 1{,}03\\,\\frac{\\text{m}^3}{\\text{h}} = 0{,}000286\\,\\frac{\\text{m}^3}{\\text{s}}, d_i = 20\\text{ mm} = 0{,}02\\text{ m}\nw = \\frac{4 \\cdot 0{,}000286}{\\pi \\cdot 0{,}02^2} \\approx 0{,}91\\,\\frac{\\text{m}}{\\text{s}}",
        tip: "Richtwerte: Wohnbereich max. 0,5–0,8 m/s wegen Fließgeräuschen."
      }
    ]
  },

  bwl: {
    title: "Formelsammlung: Meisterprüfung Teil III",
    subtitle: "Betriebswirtschaft, Rechnungswesen & Kalkulation im Handwerk",
    author: "Meisteranwärter Handwerk",
    theme: "theme-amber",
    columns: "cols-2",
    cards: [
      {
        id: "b-1",
        type: "formula",
        title: "Zuschlagskalkulation (Handwerksschema)",
        tag: "Kalkulation",
        mainFormula: "\\text{Selbstkosten} = \\text{HK} + \\text{VwGK} + \\text{VtGK}",
        derivedFormula: "\\text{Angebotspreis} = \\frac{\\text{Barverkaufspreis} \\cdot 100}{100 - \\text{Kundenskonto \\%}}",
        variables: "\\text{FM}: Fertigungsmaterial + \\text{MGK \\%}\n\\text{FL}: Fertigungslohn + \\text{FGK \\%}\n\\text{HK}: Herstellkosten = \\text{Materialkosten} + \\text{Fertigungskosten}\n\\text{BVP}: Barverkaufspreis = \\text{Selbstkosten} + \\text{Gewinn \\%}",
        example: "HK = 10.000\\,€, VwGK = 12\\%, VtGK = 8\\% \\rightarrow Selbstkosten = 12.000\\,€\nGewinn 10\\% = 1.200\\,€ \\rightarrow BVP = 13.200\\,€",
        tip: "Im Vorwärtskalkulieren wird Skonto und Rabatt 'im Hundert' aufgeschlagen!"
      },
      {
        id: "b-2",
        type: "formula",
        title: "Deckungsbeitrag & Gewinnschwelle (Break-Even-Point)",
        tag: "Kostenrechnung",
        mainFormula: "DB = E - K_v \\quad \\text{und} \\quad x_{BEP} = \\frac{K_f}{db}",
        derivedFormula: "\\text{Betriebsergebnis} = \\sum DB - K_f",
        variables: "DB: Gesamtdeckungsbeitrag [€]\nE: Netto-Erlöse [€]\nK_v: Variable Gesamtkosten [€]\nK_f: Fixkosten [€]\ndb: Stückdeckungsbeitrag = p - k_v",
        example: "Fixkosten K_f = 60.000\\,€, Stundensatz p = 75\\,€, Var. Kosten k_v = 25\\,€\ndb = 50\\,€ \\Rightarrow x_{BEP} = \\frac{60.000\\,€}{50\\,€} = 1200\\text{ verrechenbare Stunden}",
        tip: "Deckungsbeitrag I deckt die fixen Bereitschaftskosten des Meisterbetriebs ab."
      },
      {
        id: "b-3",
        type: "formula",
        title: "Kaufmännische Zinsrechnung (Deutsche Zinsmethode 30/360)",
        tag: "Finanzierung",
        mainFormula: "Z = \\frac{K \\cdot p \\cdot t}{100 \\cdot 360}",
        derivedFormula: "K = \\frac{Z \\cdot 100 \\cdot 360}{p \\cdot t} \\quad \\Leftrightarrow \\quad p = \\frac{Z \\cdot 100 \\cdot 360}{K \\cdot t}",
        variables: "Z: Zinsen [€]\nK: Kapital [€]\np: Zinssatz [\\% p.a.]\nt: Tage (jeder Monat hat 30 Tage, das Jahr 360 Tage)",
        example: "Kontokorrentkredit: K = 25.000\\,€, p = 11{,}5\\%, t = 45\\text{ Tage}\nZ = \\frac{25000 \\cdot 11{,}5 \\cdot 45}{36000} = 359{,}38\\,€",
        tip: "Skonto-Vergleich: Jahreszinssatz bei Skontoverzicht p_{eff} \\approx \\frac{\\text{Skonto \\%} \\cdot 360}{\\text{Kredittage}}."
      },
      {
        id: "b-4",
        type: "formula",
        title: "Verrechnungslohn (Kalkulatorischer Stundenverrechnungssatz)",
        tag: "Stundensatz",
        mainFormula: "\\text{Stundensatz} = \\frac{\\text{Lohnkosten} + \\text{LNK} + \\text{Gemeinkosten} + \\text{Gewinn}}{\\text{Produktive Stunden}}",
        derivedFormula: "\\text{Produktive Std./Jahr} = \\text{Anwesenheitszeit} - \\text{Rüst-/Wartezeiten} \\approx 1550 \\text{ bis } 1650\\,\\text{Std.}",
        variables: "\\text{LNK}: Gesetzliche und tarifliche Lohnnebenkosten (\\approx 75-90\\%)\n\\text{GK}: Betriebliche Gemeinkosten (Miete, Fahrzeuge, Werkzeug)\n\\text{Wagnis \\& Gewinn}: Meist 5–10\\%",
        example: "Gesamtkostenstelle Meister/Geselle pro Jahr = 90.000\\,€, prod. Std. = 1500\n\\text{Stundensatz} = \\frac{90.000\\,€}{1500\\text{ h}} = 60{,}00\\,\\frac{€}{\\text{h}} + \\text{Gewinn}",
        tip: "Krankheits- und Urlaubstage dürfen niemals in die produktiven Stunden eingerechnet werden!"
      }
    ]
  },

  blank: {
    title: "Meine Meister-Formelsammlung",
    subtitle: "Individuelle Formeln & Prüfungsschwerpunkte",
    author: "Meisteranwärter",
    theme: "theme-navy",
    columns: "cols-2",
    cards: [
      {
        id: "b-blank-1",
        type: "formula",
        title: "Erste Formel hier eintragen",
        tag: "Kategorie",
        mainFormula: "y = \\frac{a \\cdot b}{c}",
        derivedFormula: "a = \\frac{y \\cdot c}{b}",
        variables: "y: Ergebnisgröße\na, b, c: Eingangsparameter",
        example: "Beispielrechnung hier notieren",
        tip: "Hier Prüfungsfalle oder Einheitenhinweis notieren."
      }
    ]
  }
};
