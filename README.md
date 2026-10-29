# Lietuvos paplūdimių stebėsena

## Įrankio aprašymas

Šis internetinis įrankis skirtas Lietuvos paplūdimių vandens kokybės, maudynių sąlygų ir temperatūros stebėjimui.

Tai yra atviras įrankis visiems paplūdimių lankytojams, šiuo metu papildomos registracijos nereikia;

Naudotojas gali:

- pasirinkti paplūdimį ir peržiūrėti vandens stebėjimų informaciją bei ankstesnius stebėjimus.
- įvesti savo duomenis apie vandens temperatūrą, vandens kokybė ("žydėjimo" lygį) ir bangavimo lygį (galbėtojų iškeliamų vėliavų atitikmuo), kuris atitinka saugumo maudymuisi kriterijų:
  - Vandens kokybė ("žydėjimo" lygis):
    - Puiki - vanduo yra skaidrus, nematyti vandenyje plaukiojančių dalelių, vandens spalva nėra pakitusi;
    - Gera - vanduo yra šiek tiek drumstesnis, matyti vandenyje plaukiojančios dalelės, tačiau kiekis nėra didelis, vanduo yra šiek tiek žalsvas ar rusvas;
    - Bloga - vanduo yra neskaidrus, matyti didelis kieks plaukiojančių dalelių, užsidėjusios plėvelės vandens paviršiuje, vanduo itin žalios, rusvos spalvos, jaučiamas nemalonus kvapas;
  - Bangavimas (galbėtojų iškeliamų vėliavų atitikmuo):
    - Žalia - saugu maudytis - vandens paviršius ramus, bangų nėra;
    - Geltona - atsarbiai - vandens paviršius banguoja, bangos iki 30 cm, nėra atgalinių srovių;
    - Raudona - naudytis draudžiama - vandens paviršius ypač banguoja, bangos daugiau nei 30 cm, susiformavusios bangų gožos zonos, stiprios atgalinės srovės;

## Pagrindinės funkcijos

- Įvestų paplūdimių, kuriuose yra atlikti stebėjimai, peržiūra interaktyviame žemėlapyje;
- Vandens stebėjimų peržiūra;
- Vandens temepratūros stebėjimų istorijos peržiūra;
- Naujo paplūdimio pridėjimas;
- Naujo stebėjimo pridėjimas;
- Stebėjimų redagavimas ir ištrynimas;
- Paplūdimių redagavimas ir ištrynimas (jeigu nėra su paplūdimiu susijusių stebėjimų);

## Duomenų modeliai

Duomenys saugomi MongoDB duomenų bazėje.

### Paplūdimys (`Papludimys`)

Paplūdimio modelyje saugoma pagrindinė informacija apie paplūdimį:

- `pavadinimas` – paplūdimio pavadinimas.
- `miestas` – miestas, kuriame yra paplūdimys.
- `platuma` – geografinė platuma, naudojama paplūdimio vietai žemėlapyje nustatyti.
- `ilguma` – geografinė ilguma, naudojama paplūdimio vietai žemėlapyje nustatyti.

### Vandens stebėjimas (`Stebejimas`)

Vandens stebėjimo modelyje saugomi duomenys apie konkretaus paplūdimio vandens sąlygas:

- `papludimys` – nuoroda į paplūdimį, su kuriuo susietas stebėjimas.
- `data` – stebėjimo data.
- `vandensTemperatura` – išmatuota vandens temperatūra.
- `vandensKokybe` – vandens kokybės įvertinimas: puiki, gera arba bloga.
- `bangavimas` – bangavimo būklės kategorija: žalia, geltona arba raudona.
- `pastabos` – papildoma informacija apie stebėjimą; šis laukas nėra privalomas.

### Ryšys tarp modelių

Vienas paplūdimys gali turėti daug vandens stebėjimų. Paplūdimio negalima pašalinti, jeigu su juo yra susietas bent vientas stebėjimas.

## Naudotos technologijos

- React
- Node.js
- Express.js
- MongoDB
- Mongoose
- REST API
