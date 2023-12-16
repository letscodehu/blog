---
id: 6560
title: 'Az első IT munkahely &#8211; 3. rész'
date: '2023-01-05T18:58:42+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=6560'
permalink: /2023/01/05/az-elso-it-munkahely-3-resz/
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2023/01/pexels-thisisengineering-3861958.jpg'
categories:
    - Egyéb
    - Fejlesztés
    - 'Kocka élet'
tags:
    - első
    - IT
    - munkahely
---

Az első IT munkahely sorozatunk [második részében]({{ site.url }}/2022/12/21/az-elso-it-munkahely-2-resz/ "második részében") egy kis feladat keretében bejártad a fő monolit zegét-zugát, részt vettél egy grooming meetingen és megkaptad az első betanulós feladatodat, ami az amerikában történt foglalásokra vonatkozik, amit egy helyi törvénymódosítás követel meg a következő évtől.

A képernyő sarkába pillantasz és konstatálod, hogy már több, mint egy óra telt el azóta, hogy a frontend fejlesztő kollégád, Gábor elkezdte mesélni, hogy hogyan működik a cégnél használt speciális konfigurációs keretrendszer, ami mindenféle paraméter mentén fogja eldönteni, hogy mi is lesz egy adott változónak az értéke, de leginkább az maradt meg az egészből, hogy JSON fájlokat kell ide-oda pakolgatni és majd jó lesz.  
Utána ha ez megvan és az adott konfiguráció lekérdezhető az adott kontextus függvényében azt végig kell vezetni a rendszeren, ami igencsak combos munka, tekintve, hogy milyen sok függvényhíváson ível át az egész, mire odaérünk, ahol az iménti információ elérhető. No sebaj, ez csak favágómunka, idő kell neki és menni fog.

> A lényeg, hogy az a bizonyos flag, amit megbeszéltünk ott legyen a válaszban, hogy a frontend is haladjon. Ha bármi kérdésed van, akkor szólj nyugodtan - zárja le a történetét a Gábor, majd visszagurul a helyére és magadra hagy a feladattal.

Hú, na most kezdesz el igazán izgulni. Hogy is voltak a lépések? Megnézem, hogy a legfrissebb `master` ágon vagyok, igen, létrehozom az új branchet, aminek mi is a neve? Mi is volt egyáltalán a JIRA ticket száma?

A kötelező körök után neki is látsz, kikeresed a kódban azt a részt, ahol a konfigurációt eléred, felveszed az új kontextust, ami mentén majd kiadja az értéket, hozzáadod a változót az egyes leúszó DTO-khoz és bumm, pár óra után kész is. Eljött az ebédidő, újabb fröccsöt kapsz a munkahelyi pletykákból, kínos sztorik, félbemaradt projektek és miegymás.

Visszafelé felkapsz egy almát a konyhából és leülsz újra az asztalodhoz.

Aztán lebuildeled a projektet, de nem harapsz kettőt az almába, mire az végez. Megnézed mi is lehet az oka, utána pedig csak fogod a fejed, ugyanis a statikus analízisek és a fordító is ordít a hibák miatt. Túl hosszú fájlok, túl sok paraméter itt-ott, na meg a tesztek tucatjaiban fordítási hibák.

Ajajj! - mondod magadban és nekilátsz szépen egyesével javítgatni őket.

A tesztek amúgy is egy viszonylag új dolog számodra, mert habár kellett írni párat a bootcamp során, annyira mélységekbe nem mentetek bele, biztos tudsz majd az itteniekből tanulni.

Próbálod felidézni az ott tanultakat és annak megfelelően hozzáadsz pár tesztesetet a kódhoz, na meg kiegészíted azokat, ahol valamiért eltört a fordítás közben.

Újra lefuttatod a buldet a readme alapján és mostmár tovább jut, futnak a tesztek ezerrel és most úgy néz ki továbbjutsz a korábbi hibákon. Közel negyed óra múlva már ott virít a képernyőn a

```bash
BUILD SUCCESS
```

felirat.

Akkor kész is, egy commitba becsomagolod az egészet és fel is pusholod a repoba, így ha a villám bele is csap a gépedbe, akkor is kész vagy vele. Ezután a GitHub felületén csinálsz egy pull requestet a főágba, amit automatikusan hozzá is rendel pár csapattársadhoz, hogy nézzék át.

Büszkén felállsz a gépedtől, lezárod a képernyőt és elindulsz a konyhába egy kávéért.

> Nem is olyan nehéz ez az egész! - mondod magadban és közben azon gondolkozol, hogy vajon mi is lesz a következő feladat, amit kapsz majd

Mikor visszaérsz, lehuppansz a géped elé és e-mailek tucatjai fogadnak. Mindegyiket a github automatizmusa küldte és review commenteket tartalmaz az egyik kollégádtól. Megnyitod az egyik ilyen linket és elkezded olvasni a kommenteket, amik hiányzó teszteseteket, rossz elnevezéseket, átstruktúrálást emlegetnek, a fő komment, amivel el lett utasítva a módosításod, az pedig valami AC teszteket hiányol. Na ez meg mi lehet?

Oda is gurulsz a Gábor mellé, hogy megkérdezd, mégis mi is lenne ez?

> Ó, az AC tesztek, azt el is felejtettem! Na ez biztos tetszeni fog! - mondja ezt egy olyan mosollyal, ami nem sok jót sejtet

Utána újabb kiselőadás kezdődik, már kezded megszokni a dolgot.

Az AC tesztek az acceptance criteria tesztek lennének, amit még nem hallottál, de a korábban tanultak mentén leginkább valami hibrid user acceptance tesztekre hasonlítanak.

> Szóval mikor fut, akkor elindítja az alkalmazást, amihez az egyes be és kimeneti értékek itt-ott vannak megadva JSON fájlokként, tehát mikor kimegyünk kuponért, árakért vagy szállásokért, akkor igazából innen fogja fel az adott szálláshoz kapcsolódó értéket felolvasni, utána pedig a válaszból kell kikeresned az adott flaget, amit beleraktál, hogy ott van-e, mert a tesztek nem renderelnek. De vigyázz, mert ha nem megfelelően konfigurálod fel ezeket a kamu adatokat, akkor könnyen fals negatív tesztet tudsz gyártani. Arról nem is beszélve, hogy igen lassan indulnak el a tesztek, így meg kell fontolni, mert tíz percbe is beletelik, mire egyáltalán eljut odáig. Majd elfelejtettem, mivel az AC tesztek több szálon futnak, a stubok konfigurálása is szét van szedve, így erre is kell vigyázni - fejezi be Gábor, aki láthatóan nagyon örül annak, hogy egy ideje a frontenden dolgozik és nem kell ezzel vesződnie

Nem tudod eldönteni, hogy a hallottak alapján Te vagy az időközben megbarnult almád a szomorúbb.

Az első IT munkahely sorozatunk [következő]({{ site.url }}/2023/01/09/az-elso-it-munkahely-4-resz/ "következő") részeiben kiderül, hogyan is zajlik a code review, a demo, összetűzések a tesztelőkkel és még sok más, ami segít bepillantást nyújtani abba, milyenek is lesznek a hétköznapok fejlesztőként.

- - - - - -

Elvégeztél egy bootcampet, de az első junior pozíció még várat magára? Esetleg már juniorként dolgozol, és szeretnél feljebb jutni a ranglétrán?

Légy a gyakornoki csapatunk tagja, ahol meglévő Java/PHP/Vue, netán automata/manuál tesztelői tudásod gyarapíthatod tovább az otthon kényelméből, legalább heti 10 órában a többiekkel közösen fejlődhetsz. Egy már kiépített fejlesztői infrastruktúra (CI/CD, VPN, JIRA, code review, AWS, K8s, fizetési és számlázási rendszerek, message streaming, serverless, IaaC) vár, amin keresztül megtanulhatod, hogyan is néznek ki a céges folyamatok és képet kapsz arról, miként kell egy már felépített rendszerben dolgozni.  
Projektjeink által hiteles referenciához juthatsz, amire bátran hivatkozhatsz a CV-dben.

Rajtad múlik, hogy kihozod-e magadból a maximumot és megszerzed azt az állást, amire mindig is vágytál.

Ha érdekel a lehetőség és szeretnél többet megtudni, dobj egy e-mailt a fejlesztes@letscode.hu címre!