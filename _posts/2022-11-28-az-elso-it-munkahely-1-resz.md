---
id: 6520
title: 'Az első IT munkahely &#8211; 1. rész'
date: '2022-11-28T10:44:07+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=6520'
permalink: /2022/11/28/az-elso-it-munkahely-1-resz/
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2022/11/pexels-marc-mueller-3807691.jpg'
categories:
    - Egyéb
    - Fejlesztés
    - 'Kocka élet'
tags:
    - első
    - fejlesztés
    - munkahely
---

Egy új munkahely szinte mindenkit izgalommal tölt el, pláne ha az egy teljesen másik iparág, mint ahol korábban dolgoztál. Egy bootcamp után még ingatag lábakon van a tudásod, de bízol magadban, hiszen okkal vettek fel. Állsz az épület recepciójánál, várod hogy a HR-es kolléga megérkezzen, közben kíváncsian fürkészed az előteret. Korábban még nem láttad, hiszen az egész interjúfolyamat online zajlott le, így most van először lehetőséged szemügyre venni. Kijelzőkön pörögnek a cég ügyfeleinek sikertörténetei, hírek a legutóbbi egyesülésről, közben kollégák szállingóznak el melletted. A liftajtó kinyílik és már nyomják is a kezedbe a badget, amivel immáron be tudsz lépni az épület bármely pontjára.

> Az épületben két emeletet bérlünk, a Te csapatod a hatodikon lesz, de a hetedik is a mienk, először oda megyünk.

Kerestek magatoknak egy szimpatikus tárgyalót, ahol el lehet intézni a papírmunkát, amire eddig nem volt lehetőség. Asztalok tucatjai mellett haladtok el, egyesek állnak mellette, mások ülnek, pár babzsák várja a bátrabbakat és hangszigetelt boxokban már zajlanak a 1:1 meetingek. Elsétáltok egy nagy kijelző mellett, ahol a föld kiterített térképén villannak fel a fények.

> Igen, ezt a térképet egy hackathon ihlette, látszik rajta, hogy a világon hol foglaltak éppen egy szállást a rendszerünkben, hát nem király?

A szükséges papírmunka és egy rövid biztonsági tréning után elkísérnek az IT-hoz, ahol már elő van melegítve a laptopod, szinte minden elérés be van rajta állítva, már csak testre kell szabnod. Megnyugtatnak, hogyha bármi kell, plusz monitor, külső touchpad, billentyűzet vagy ilyesmi, akkor csak szólj.

Megérkeztek a hatodikra, a csapatod asztalához. Habár többnyire remote dolgoznak, most mindannyian itt vannak, hogy üdvözöljenek. Itt már látsz ismerős arcokat, hiszen van akivel innen már volt alkalmad beszélni az interjú során. A HR munkatársa el is köszön és átadja a stafétát a csapat vezetőjének, aki hagy szusszanni egyet, mielőtt bedobna a mélyvízbe.

Leülsz az asztalodhoz, felnyitod a laptopod és ellenőrzöd, hogy a belépési kód, amit megadtál működik-e. Ezután az e-mailjeid következnek, ahol máris egy tucat olvasatlan fogad, a különböző kötelező tréningek, meghívók a daily standupra és egyéb meetingekre, de egy közülök a csapatvezetőtől van, amiben a fejlesztői onboarding wiki oldal szerepel. Ezen szépen elkezdesz végigmenni és feltelepítgeted az egyes eszközöket. Build tool, git, IDE, docker. Beállítod a könyvjelzőket a különböző eszközökhöz, CI, JIRA, staging és éles környezet linkjei, céges github és még sok más, amiről azt se tudod, hogy eszik-e vagy isszák. Mire a végére érsz máris dél, így a kollégáidhoz csapódsz és végre van alkalmuk kifaggatni arról, hogy honnan jöttél, milyen volt az interjú és rögtön hallod a céges pletykákat is.

Az ebéd után a csapatvezető melléd telepszik, hiszen ideje végigvezetni Téged a projekten, hogy is néz ki, melyik csapat miért is felel, kinek ki a főnöke, kihez kell fordulni ha ilyen-olyan gondod van és a délután elrepül anélkül, hogy a végére érnétek. Kicsit el is bizonytalanodsz, hiszen olyan, mintha ezer féle dolgot kellene még megtanulnod, mielőtt az első kódsort elkezdhetnéd.  
Hazaérve előkapod a jegyzetedet, amit nap közben írtál és elkezdesz utánaolvasni azoknak az eszközöknek, amiket aznap meséltek, hogy másnap ennyivel is előrébb legyél, de már ez első kulcsszó, a "CI", azaz "continous integration" is annyi találatot eredményez, hogy azt se tudod hogy is kezdj neki.

Másnap kicsit korábban érkezel, abban reménykedve, hogy a standup előtt még sikerül elkapni a leaded és kifaggatni a dolgokról.  
Végre eljuttok oda, hogy sikerül a projektet kicsekkolni és végre valami kódot is láss. Amikor megnyitjátok a githubon, már akkor látod, hogy ez közel sem akkora, mint amihez szoktál, a klónozás percekig tart, ezrével érkeznek a commitok, de végül csak ott van minden a gépeden.

Az indítása sem olyan roppant egyszerű, több komponensből áll, amihez máris kell a docker-compose, amivel korábban nem volt dolgod. Elindítod hát a leadtől kapott paranccsal és laptopod felzúg, de kitart. A fő monoliton a sor, aminek az elindításához a paramétereket egy másik parancs adja ki, itt már kicsit kezded elveszteni a fonalat, hiszen a bootcamp során eddig pár kattintás volt elindítani a projekteket.

A terminálban ömlenek a logüzenetek, végül megáll és egy `Application started` szöveg alatt villog a kurzor.

> A hosts fájlt átírtad? - kérdezi a csapatvezető

Ezzel pedig kezdetét veszi egy újabb tíz perces procedúra, aminek a végén már nem localhostként kell megnyitnod az adott projektet, hanem egy speciális domainnel, ugyanis több monolitból tevődik össze az oldal, aminek csak egy része fut most a gépeden, hiszen a vásárlási folyamat utolsó lépéséért felelős csapatba kerültél, minek futna a keresés, stb. is, amikor azok is egyenként több gigabájt memóriát igényelnek.

Ezután ismét egy új oldal kerül elő, amit máris felveszel a könyvjelzők közé, ahol el kell kezdened mappákba rendezni a dolgokat, mert már annyi minden került fel oda is. Ez az oldal tud URL-t generálni, amit aztán a gépeden meg tudsz nyitni, hogy egy fizetőoldal megjelenjen. Egy másik, tesztelők által használt bookmarklet segítségével kitöltitek a fizetési űrlapot és rányomtok a Fizetés gombra. A felugró ablak percekig tölt, különböző lépéseken megy át a folyamat és végül a fizetés megerősítve oldalon landoltok. Ezután még percekig faggatod, hogy mi miért van vagy éppen miért úgy, ami kérdésekre sokszor, az "ennek története van" a válasz.

> Akkor gyakorlásképpen találd meg nekem, hogy hol is megyünk ki kuponért! - majd visszagurul a helyére.

Ezzel pedig kezdetét veszi az első, nem hivatalos feladatod a cégnél.

Az első IT munkahely sorozatunk [következő]({{ site.url }}/2022/12/21/az-elso-it-munkahely-2-resz/ "következő") részeiben kiderül, hogyan is zajlik a fejlesztés, a code review, a demo, összetűzések a tesztelőkkel és még sok más, ami segít bepillantást nyújtani abba, milyenek is lesznek a hétköznapok fejlesztőként.

- - - - - -

Elvégeztél egy bootcampet, de az első junior pozíció még várat magára? Esetleg már juniorként dolgozol, és szeretnél feljebb jutni a ranglétrán?

Légy a gyakornoki csapatunk tagja, ahol meglévő Java/PHP/Vue, netán automata/manuál tesztelői tudásod gyarapíthatod tovább az otthon kényelméből, legalább heti 10 órában a többiekkel közösen fejlődhetsz. Egy már kiépített fejlesztői infrastruktúra (CI/CD, VPN, JIRA, code review, AWS, K8s, fizetési és számlázási rendszerek, message streaming, serverless, IaaC) vár, amin keresztül megtanulhatod, hogyan is néznek ki a céges folyamatok és képet kapsz arról, miként kell egy már felépített rendszerben dolgozni.  
Projektjeink által hiteles referenciához juthatsz, amire bátran hivatkozhatsz a CV-dben.

Rajtad múlik, hogy kihozod-e magadból a maximumot és megszerzed azt az állást, amire mindig is vágytál.

Ha érdekel a lehetőség és szeretnél többet megtudni, dobj egy e-mailt a fejlesztes@letscode.hu címre!