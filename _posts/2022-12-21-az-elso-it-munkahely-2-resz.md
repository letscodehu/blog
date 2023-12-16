---
id: 6531
title: 'Az első IT munkahely &#8211; 2. rész'
date: '2022-12-21T14:24:34+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=6531'
permalink: /2022/12/21/az-elso-it-munkahely-2-resz/
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2022/12/pexels-markus-spiske-61903271.jpg'
categories:
    - Egyéb
    - Fejlesztés
    - 'Kocka élet'
tags:
    - debugging
    - első
    - fejlesztés
    - munkahely
---

Az első IT munkahely sorozatunk [első részében]({{ site.url }}/2022/11/28/az-elso-it-munkahely-1-resz/ "első részében") megérkeztél a céghez, bemutattak a tagoknak, megkaptad a céges laptopod, készen áll a fejlesztői környezet és már az alkalmazás is ott dübörög a gépeden. Első, nem hivatalos feladatként pedig azt kaptad, hogy találd meg a kódrengetegben, hogy hol is megyünk ki a kuponokat ellenőrizni.

A fő monolit, amin dolgozni kell, önmagában is kétszázezer sor kódból áll, így megtalálni azt a bizonyos helyet nem lesz olyan könnyű. Lévén csak a foglalásért felelős rész tartozik hozzátok, így a felületen hamar megtalálod, hogy hol is lehet kuponokat beváltani az oldalon, majd egy kis célzott keresés után megtalálod a `CouponApplyController`-t, valószínűleg ez lesz a cél, így oda is biggyesztesz egy töréspontot az `apply` metódusába és debug módban elindítod az alkalmazást, beírsz valami véletlenszerű kuponkódot, beváltás gomb, várod, hogy megálljon az említett sornál, majd egy pár másodperc múlva megpillantod a hibaüzenetet az oldalon, hogy bizony a megadott kupon nem érvényes.

> Na szép, de hogy jött erre rá, hiszen bele se futott a metódusba!?

Tovább folytatod a nyomozást és rájössz, hogy bizony van egy `@ModelAttribute`-al felannotált metódus is, ami hamarabb meghívódik mint az `apply`, így biztos itt lesz valami turpisság. Nem is csoda, hiszen ez a kétszer olyan hosszú, mint maga az `apply`, biztos itt történik a lényeg.

Újrapróbálod, itt már megakad a break pointon!

Belefutsz egy több száz tagváltozóval felvértezett `Context` objektumba, amit, ahogy haladsz lentebb, egyre mélyebbre passzolgatnak és módosítgatnak különböző osztályok. Ennek az osztálynak van egy `Order`-t tartalmazó része, amiben találsz valamit a kuponokról, biztosra veszed, hogy jó úton jársz.

Még fél óra lépkedés a metódusok mélyén és egy `CouponService` nevű interfészt megpillantasz. Na ez lesz az! Ahogy továbblépkedsz mindenféle keretrendszer specifikus proxy és hasonló osztályok jönnek a végtelenségig, így elkönyveled, hogy ez már valami webservice hívás lesz.

Büszkén odasétálsz a leadhez és közlöd is vele, hogy megtaláltad!

> Az irány jó, de még nem az igazi. Kutakodj egy kicsit tovább!

Ennél is tovább? Hát jó. Körbenézel az interfész implementációi után kutatva, de valami külső függőségben van, ráadásul nem is egy.

A `redeem` függvénye azonban mindegyiknek `abstract`. Hogy lehet ez? Hol van az implementációja??

A stackoverflow-t bújva találsz egy olyan technikát, aminek a segítségével felül lehet írni egy metódusát egy osztálynak AOP segítségével és ezt többféleképpen lehet konfigurálni. Végső elkeseredésedben már az xml fájlokban is nekiállsz keresgélni az adott metódus neve után és bumm, meg is találod.  
Le van cserélve egy másik osztály másik metódusának az implementációjával. Mi ez az őrültség?  
Sikerül túltenni magad a dolgon, így folytatod a debugolást és végül megtalálsz HTTP-hez kapcsolódó neveket a kódban.

Tanulva a korábbi hibádból, az utolsó lépésig végigköveted, ami egy

```java
url.connect()
```

újra megkörnyékezed a csapatvezetőt, aki elismerően bólint:

> na igen, ez lesz az

Ebédszünet következik, ami után egy grooming meetingre is meghívnak. Egy kisebb tárgyalóba becammog a csapat, a lead a laptopjával felcsatlakozik a kivetítőre, ahol óriásiban is látod a ticketing rendszert. Sorban nyílnak a storyk és már röpködnek is a három betűs rövidítések, amiknek a feléből alig értesz valamit, de úgy vagy vele, hogy majd idővel mindegyiknek utána jársz a céges wikin, ahol van egy külön rövidítésekre specializálódott aloldal.

Az egyik feladatnál hallod a neved, meg azt, hogy ez jó lesz betanulós storynak, hiszen nem sürgős, viszonylag egyszerű és még frontend munka is van vele, tehát össze kell dolgozni egy másik kollégával. Ajajj, gondolod magadban, rögtön a mélyvíz, de megnyugtatnak, hogy csak egy kis átstruktúrálása a válasznak, meg egy konfigurációt kell kiolvasni, biztos menni fog.

A meeting után összeültök a frontendes kollégával, hogy átbeszéljétek a feladatot. Tényleg nem hangzik bonyolultnak, azok után, amiket hallottál. Egy speciális template rendszer ül a backend előtt, ami JSON kimenetet használ, ezt kell kicsit átstruktúrálni és egy új mezőt belerakni.

Most, hogy újra átolvastad a ticketet, jobban érted a szándékot is. Másként néz ki az oldal egyes országokban és itt most egy friss amerikai törvénymódosítás miatt ugyanolyanra kell formázni a végösszeget és a kedvezményekkel csökkentett összeget, de csak amerikából kezdeményezett foglalások esetén. Nem lehet halványabb, kisebb betűtípus és hasonlók. Mindent a backendtől kapott adatok vezérelnek, a frontend ilyen formán elég buta.

Na, ez egész jól hangzik, perektől lehet megmenteni vele a céget és még lesz látszatja is, amit akár meg tudsz mutatni otthon, hogy bizony ezt én csináltam!

Az első IT munkahely sorozatunk [következő]({{ site.url }}/2023/01/05/az-elso-it-munkahely-3-resz/ "következő") részeiben kiderül, hogyan is zajlik a code review, a demo, összetűzések a tesztelőkkel és még sok más, ami segít bepillantást nyújtani abba, milyenek is lesznek a hétköznapok fejlesztőként.

- - - - - -

Elvégeztél egy bootcampet, de az első junior pozíció még várat magára? Esetleg már juniorként dolgozol, és szeretnél feljebb jutni a ranglétrán?

Légy a gyakornoki csapatunk tagja, ahol meglévő Java/PHP/Vue, netán automata/manuál tesztelői tudásod gyarapíthatod tovább az otthon kényelméből, legalább heti 10 órában a többiekkel közösen fejlődhetsz. Egy már kiépített fejlesztői infrastruktúra (CI/CD, VPN, JIRA, code review, AWS, K8s, fizetési és számlázási rendszerek, message streaming, serverless, IaaC) vár, amin keresztül megtanulhatod, hogyan is néznek ki a céges folyamatok és képet kapsz arról, miként kell egy már felépített rendszerben dolgozni.  
Projektjeink által hiteles referenciához juthatsz, amire bátran hivatkozhatsz a CV-dben.

Rajtad múlik, hogy kihozod-e magadból a maximumot és megszerzed azt az állást, amire mindig is vágytál.

Ha érdekel a lehetőség és szeretnél többet megtudni, dobj egy e-mailt a fejlesztes@letscode.hu címre!