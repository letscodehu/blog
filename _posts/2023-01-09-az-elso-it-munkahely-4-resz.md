---
id: 6583
title: 'Az első IT munkahely &#8211; 4. rész'
date: '2023-01-09T13:22:41+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=6583'
permalink: /2023/01/09/az-elso-it-munkahely-4-resz/
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2023/01/pexels-cottonbro-studio-5473957.jpg'
categories:
    - Egyéb
    - Fejlesztés
    - 'Kocka élet'
tags:
    - első
    - IT
    - munkahely
---

Az első IT munkahely sorozatunk [harmadik részében]({{ site.url }}/2023/01/05/az-elso-it-munkahely-3-resz/ "harmadik részében") elkezdtél dolgozni az első betanulós feladatodon, ami nagyobb falat, mint eredetileg gondoltad. Főleg miután beavatnak a helyi user acceptance tesztek rejtelmeibe.

Már egy napja próbálkozol kizöldíteni a tesztet, amit írtál. Egy kis pair programming során egy korábbi tesztet vettél alapul, ami egy szállás oldalát nyitja meg és foglalási oldalon ellenőríz valamilyen értékeket. Hasonló, amit a feladatodban is el kell érned, csak itt az Egyesült Államokból indított foglalás során várod, hogy a szükséges flag ott legyen a megfelelő értékkel, ha már ez végre megy, akkor foglalkozol a negatív tesztekkel. Legalábbis ezt javasolták, mondván, így is elég lassú lesz a folyamat.

Nem segít az a tény, hogy bizony újrafordítani az alkalmazást még így modulokra bontva is percekbe telik, az elindítása pedig a tíz percet súrolja, így minden egyes módosítás utáni elindítással rengeteg idő megy el.

Visszasírod a bootcampes időket, amikor csak átírtál valamit a kódban és mire visszamentél a böngészőbe, már tükröződött is a módosítás.

A többiek már elkezdtek szállingózni az irodából, de most úgy érzed, közel vagy a megoldáshoz. Aztán, a körülbelül a huszadik módosítás és indítás után, mikor végez az árván futtatott teszted, ismét a boldogító

```bash
BUILD SUCCESS

```

felirat vár a terminál ablakban.

Szerencse, hogy már pár perce egyedül vagy a helységben és senki nem látja, ahogy örömödben éljenzel. Nem volt egyszerű, de meglett. Ez a feladat eszedbe juttatta, hogy miért is szerettél bele ebbe a szakmába. Mert mindig újabb és újabb akadályokba ütközöl, amiket még pont le tudsz győzni és ez újra lendületet ad, amivel leküzdöd a következő akadályt is.

Na akkor itt az ideje gyors összedobni a negatív tesztet is. Egy kis copy paste, átírsz pár dolgot a tesztedben, duplikálod és módosítod a szállás leíró fájlját, hogy úgy tűnjön mintha ez Németországból érkező foglalás lenne és lefuttatod ezt a tesztet is. Addig teszel egy kört az irodában, gyönyörködsz a város fényeiben. Kicsit irigykedsz a data csapatra, amiért ők közvetlenül a Lánchídra néző helyen ülhetnek, pedig alig járnak be, de hát ez már csak ilyen.

Visszamész a gépedhez, és nem hiszel a szemednek, elsőre sikerült jól összeállítani a tesztet. Akkor már csak a teljes tesztsorozatot kell lefuttatnod, de azt már csak holnap várod meg, mert későre jár.

Másnap reggel összefutsz a Gáborral és büszkén meséled neki, hogy sikerült összelőni a teszteket, sőt már a negatív eset is megy, csak a komplett test suite várat még magára.

A helyedhez érve ledokkolod a laptopodat és szinte azonnal indítod a teszteket. Az este már-már azon is gondolkoztál, hogy otthon elindítsd, de utána letettél róla, nem akarsz a szabadidődben is ezzel foglalkozni, pláne hogy így is egész jól haladtál.

Most kezdetét veszi a várakozás, ugyanis a teljes test suite elég sok időt vesz igénybe, de pont lesz időd megreggelizni addig. A konyhából visszafelé újabb örömhír fogad, a teljes suite is zöld lett, így nincs más hátra, csak a maradék review itemre kell ránézni a pull requesteden és már-már kész is a feladat, pedig még a sprint alig kezdődött el!

Ha ez így megy, akkor nem is lesz olyan vészes ez az egész nagy céges élet.

Odagurulsz a csapatotok egyik tesztelőjéhez, Judithoz, ugyanis a leírás szerint kell egy úgynevezett QA demo, aminél a tesztelőnek bemutatod az elkészült feature-öt, hogy legyen egy kis rálátása, esetleg már a tesztelés megkezdése előtt mondjon olyan eseteket, amikre lehet nem gondoltál, így még időben tudod javítani.

Elindítod az alkalmazást a saját gépeden, addig ő is odajön a kis jegyzetfüzetével, Te pedig bemutatod, hogy igen, XY szállás foglalási oldalát megnyitva, ha bekapcsolod a debugot és meg tudod nézni a JSON-t, amit visszaad a backend, akkor ott van az a bizonyos flag, ha pedig nem, akkor nincs. Mivel a frontend még nincs kész, ezért a kettő integrációját most nem tudod megmutatni, de ha kikerül a tesztkörnyezetre, ott már meg lehet oldani, addig be kell érni ezzel.

> Hát jó, reméljük ott már működni fog - jegyzi meg kissé lemondóan Judit

Ez kicsit szívenütött, de nem engeded, hogy kedvedet szegjék, hiszen a fejlesztés része már kész van, innen már más dolgozik vele, úgyhogy elégedetten hátradőlsz a székedben és nézegeted a backlogot, hátha találsz valami érdekes feladatot a sprint hátralevő részére.

Az első IT munkahely sorozatunk következő részeiben kiderül, hogyan is zajlik a demo, milyen ha bugot hagysz a kódban, összetűzések a tesztelőkkel vagy más fejlesztőkkel és még sok más, ami segít bepillantást nyújtani abba, milyenek is lesznek a hétköznapok fejlesztőként.

- - - - - -

Elvégeztél egy bootcampet, de az első junior pozíció még várat magára? Esetleg már juniorként dolgozol, és szeretnél feljebb jutni a ranglétrán?

Légy a gyakornoki csapatunk tagja, ahol meglévő Java/PHP/Vue, netán automata/manuál tesztelői tudásod gyarapíthatod tovább az otthon kényelméből, legalább heti 10 órában a többiekkel közösen fejlődhetsz. Egy már kiépített fejlesztői infrastruktúra (CI/CD, VPN, JIRA, code review, AWS, K8s, fizetési és számlázási rendszerek, message streaming, serverless, IaaC) vár, amin keresztül megtanulhatod, hogyan is néznek ki a céges folyamatok és képet kapsz arról, miként kell egy már felépített rendszerben dolgozni.  
Projektjeink által hiteles referenciához juthatsz, amire bátran hivatkozhatsz a CV-dben.

Rajtad múlik, hogy kihozod-e magadból a maximumot és megszerzed azt az állást, amire mindig is vágytál.

Ha érdekel a lehetőség és szeretnél többet megtudni, dobj egy e-mailt a fejlesztes@letscode.hu címre!
