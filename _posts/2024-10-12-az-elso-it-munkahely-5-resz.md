---
title: 'Az első IT munkahely &#8211; 5. rész'
date: '2024-10-12T13:22:41+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=6583'
permalink: /2024/10/12/az-elso-it-munkahely-5-resz/
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2024/10/pexels-markusspiske-1089438.jpg'
featured: true
categories:
    - Egyéb
    - Fejlesztés
    - 'Kocka élet'
tags:
    - első
    - IT
    - munkahely
---
Az első IT munkahely sorozatunk [negyedik részében]({{ site.url }}/2023/01/09/az-elso-it-munkahely-4-resz/ "negyedik részében") sikeresen teljesítetted az első komolyabb fejlesztési feladatodat. A flag már megjelent a backendben, a negatív tesztek is lementek, sőt, még a QA demo is megtörtént. Most már nincs más hátra, mint várni, hogy a frontend csapat is elkészüljön a saját részével, és a teljes feature integrálódjon a rendszerbe.

A napod viszonylag nyugodtan indul, épp átnézed a backlogot, amikor felvillan egy új Slack-értesítés. A QA-tól érkezett: Judit tesztelte az új fejlesztést a tesztkörnyezetben, és talált egy hibát. A flag néha eltűnik, amikor bizonyos körülmények között érkezik foglalás – például ha az Egyesült Államok helyett Kanadából indítják.

Ahogy elolvasod az üzenetet, a gyomrod összeszorul. Gyorsan előkeresed a tesztjeidet, és átgondolod, vajon mi csúszhatott félre. Hiszen a tesztek zöldek voltak, minden működött, amikor Te futtattad! Mégis valami elkerülhette a figyelmedet.

Átgörgetsz a kódban, próbálod megtalálni, mi lehet a probléma. Elsőként a foglalási logikát nézed át, majd a konfigurációs fájlokat. A frontenden megjelölt flag kódjával minden rendben, de valami apró, rejtett összefüggés miatt bizonyos foglalásoknál a backend nem megfelelően kezeli a felhasználó régióját.

Nem telik el sok idő, mire észreveszed: egy korábbi konfigurációs beállításnál az észak-amerikai országokat egyetlen régióként kezelik, de a tesztek kizárólag az Egyesült Államokra fókuszáltak. A flag a régióra van lekötve, viszont a tesztadatokban nem volt Kanada, így kimaradt egy fontos edge case.

> "Ez az!" – gondolod magadban, de tudod, hogy most jön az igazi munka. Gyorsan nekilátsz egy új tesztírásnak, ami Kanadára is lefedi a funkciót. 

Juditnak válaszolsz egy rövid üzenetben, hogy megtaláltad a hibát, és dolgozol rajta. Ezután átírod a foglalás logikáját, hogy a regionális beállításoknál figyelembe vegye Kanadát is, majd hozzáadod az új tesztadatokat a projektedhez. Miközben a kódot javítod, már látod, hogy ez az aprócska változtatás milyen jelentős hatással lehet a teljes foglalási folyamatra. A korábban már megszokott lassú build és tesztelési folyamat ezúttal sem lesz gyorsabb.

Néhány órával és egy ebédszünettel később végre lefutnak az új tesztek, és minden rendben van. Az új commitot gyorsan becsomagolod, és pusholod a távoli repóba. Ahogy leadod az új pull requestet, már tudod, hogy ez most egy sokkal alaposabb megoldás.

Nem sokkal később érkezik is a válasz Judittól: „Köszönöm, most minden rendben van a Kanadára vonatkozó foglalásokkal is.” Ez a rövid üzenet igazi megkönnyebbülést hoz. Úgy tűnik, a sprint elején már ki is pipálhatod ezt a feladatot, és reménykedsz, hogy a következő feladat kicsit könnyebb lesz.

De persze, a QA világában sosem lehet biztosra menni. Az egyik Slack csatornában látod, hogy a tesztelők egy újabb bugról beszélnek – nem a Te feladatodhoz kapcsolódik, de figyeled, ahogy a kollégák küzdenek egy újabb rejtélyes hibával. Gondolatban már készülődsz a következő nagy kihívásra. Fejlesztőként mindig van valami, ami előbb-utóbb rád talál.

Az első IT munkahely sorozatunk következő részeiben kiderül, mi is történik akkor, amikor nem sikerül ilyen jól tesztelni és hibát hagysz a kódban, a demo és még sok más, ami segít bepillantani, milyenek is lesznek a hétköznapok fejlesztőként.

- - - - - -

Elvégeztél egy bootcampet, de az első junior pozíció még várat magára? Esetleg már juniorként dolgozol, és szeretnél feljebb jutni a ranglétrán?

Légy a gyakornoki csapatunk tagja, ahol meglévő Java/PHP/Vue, netán automata/manuál tesztelői tudásod gyarapíthatod tovább az otthon kényelméből, legalább heti 10 órában a többiekkel közösen fejlődhetsz. Egy már kiépített fejlesztői infrastruktúra (CI/CD, VPN, JIRA, code review, AWS, K8s, fizetési és számlázási rendszerek, message streaming, serverless, IaaC) vár, amin keresztül megtanulhatod, hogyan is néznek ki a céges folyamatok és képet kapsz arról, miként kell egy már felépített rendszerben dolgozni.  
Projektjeink által hiteles referenciához juthatsz, amire bátran hivatkozhatsz a CV-dben.

Rajtad múlik, hogy kihozod-e magadból a maximumot és megszerzed azt az állást, amire mindig is vágytál.

Ha érdekel a lehetőség és szeretnél többet megtudni, dobj egy e-mailt a fejlesztes@letscode.hu címre!
