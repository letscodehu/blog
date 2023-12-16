---
id: 1500
title: 'Vissza a jövőbe &#8211; Legacy kódok'
date: '2017-01-30T04:10:41+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1500'
permalink: /2017/01/30/vissza-jovobe-legacy-kodok/
tie_post_bg:
    - ''
    - ''
tie_post_color:
    - ''
    - ''
tie_gallery_style:
    - slider
    - slider
tie_link_url:
    - ''
    - ''
tie_link_desc:
    - ''
    - ''
tie_video_url:
    - ''
    - ''
tie_embed_code:
    - ''
    - ''
tie_audio_mp3:
    - ''
    - ''
tie_audio_m4a:
    - ''
    - ''
tie_audio_oga:
    - ''
    - ''
tie_audio_soundcloud:
    - ''
    - ''
tie_quote_author:
    - ''
    - ''
tie_quote_link:
    - ''
    - ''
tie_quote_text:
    - ''
    - ''
tie_status_facebook:
    - ''
    - ''
tie_status_twitter:
    - ''
    - ''
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2017/01/09215637/from-legacy-code-to-continuous-integration-6-638.jpg'
categories:
    - Egyéb
tags:
    - code
    - developer
    - legacy
    - management
    - php
    - quality
    - refactor
---

A mai nap az egyik facebook csoportban felröppent a kérdés, miszerint óhatatlanul is 'gány'-e minden kód, amit öröklünk. Az eddigi cikkekel ellentétben most nem fogunk hirtelen legacy kódot gyártani, tehát nem lesz semmiféle gyakorlati megvalósítás, így aki copy-paste ügyében jött, azt most el kell keserítsem. Akit viszont érdekel egy hosszabb vélemény a legacy kódokról, az a tovább gomb után megtalálja 🙂[![](assets/uploads/2017/01/from-legacy-code-to-continuous-integration-6-638.jpg)](assets/uploads/2017/01/from-legacy-code-to-continuous-integration-6-638.jpg)

Akkor jöjjön először is a definíció, hogy mégis mi számít legacy kódnak? A legacy szó magyarul '[örökség](http://port.hu/adatlap/film/tv/az-orokseg-dedictvi-aneb-kurvahosigutntag/movie-7920), hagyaték', ennélfogva a nevében nincs semmi konkrétum arról, hogy óhatatlanul is szívjunk vele, vagy hogy épp ami nem COBOL vagy FORTRAN, az nem is igazán legacy.

Ha a [wikipédia](https://en.wikipedia.org/wiki/Legacy_code) segítségét kérjük, ő már valamivel jobban leírja, miszerint attól lesz egy kódbázis legacy, mert már nem támogatott technológiákkal kapcsolatos, pl. támogatnunk kell a programunkkal a soros portot, windows XP-t, <del>IE7-et, PHP5.2.4-et.</del> Tehát a Wikipédia a backward kompatibilitást érti ez alatt, amikor túúúl hosszú ideig megtartjuk azt. Ha a WordPressre gondolunk, akkor meg is van az első ilyen eset, ahol amiatt nem tudnak nagytakarítani, mert akkor biza oda lenne a PHP 5.2.4! kompatibilitása.

Sokszor azonban nem is kell 10 éveket visszautazni az időben, ahhoz, hogy szörnyűségekre bukkanjunk. A programozó szakmát többféleképpen lehet űzni. Ha a PHP-t emeljük ki, akkor lehet multicégnél, kis/nagy cégnél, netán egyéni vállalkozásban is dolgozni. Az, hogy az ember nagy cégnél dolgozik, még önmagában nem egyenlő azzal, hogy együtt is dolgoznak, hiszen sok helyen csak úgy szórják ki a kisebb site-okat. A legtöbb cégnél mostanság egyre divatosabb lett full-stack gurukat alkalmazni, akikre rábízhatják a frontend/backendet egyaránt és gyakran egy maguk visznek végig projekteket, anélkül, hogy bárki mással kooperálni kellene. Egyéni vállalkozásban, kis cégnél ez méginkább igaz. Az ember pedig egyedül dolgozva ellustul. Nincs aki ránézne a kódjára, aki megszólná érte, nincsenek előírások a kódminőségre, viszont egy dolog van:

### határidő.

Ha nincsenek minőségi elvárások, akkor bizony mennyiségi elvárások lesznek, mégpedig mindez a menedzsment felől érkezik.

Nézzük meg István történetét:[![](assets/uploads/2017/01/IT-GUY.jpg)](assets/uploads/2017/01/IT-GUY.jpg)

Full stack fejlesztő barátunk nemrégiben felvételt nyert egy kisebb céghez, ahol biza százával hányják ki a kisebb-nagyobb, de főleg kisebb site-okat. Nem agilisen, hanem az ún. ASAP driven development mentén dolgoznak, úgyhogy mindent a megrendelés napja előtt le kellene szállítani. István egy olyan programozó, akinek elvei vannak, ezért a kódját megpróbálja jól szervezni, a legtöbb esetben gondol a jövőre, a view fájlokban fordítókulcsokat használ, stb.. összességében véve, jó munkát végez. Ezzel a hozzáállással tud is szállítani elég jó tempóban apróbb oldalakat. Ellenben a projekt menedzsernek az a mottója, hogy "addig pakold a melót a parasztra, ameddig bírja, mert addig még van benne kapacitás", ennélfogva István munkáját lassúnak ítéli, többet vár tőle.

István az egyik ilyen státusz meetingen véletlenül elszólja magát: "ha ennél is jobban sietek, akkor nem lesz szép a kód". Több sem kell a PM-nek, aki jól leszidja Istvánt, amiért ilyen, üzletileg jelentéktelen tényezők miatt lassabb, mint a többiek. Lévén a programozók nem éppen az asszertív viselkedésükről híresek, ezért István nem nagyon tudja/akarja megvédeni az igazát, így hát beáll a többi kóder közé a sorba. Mostantól nem ír teszteket, felhagy a SOLID elvekkel, korábbi projektekből másolgat át osztályokat egyesével, composer csomagok belsejébe hekkel, mert nincs idő míg elfogadják a pull requestet és hasonlók. A projektmenedzser örömmel látja, hogy bizony István közel húsz százalékkal jobban teljesít, mint eddig. Ha bármiféle support kellett, akkor mindig azt az embert keresték meg, aki azt az oldalt csinálta, hisz ő írta.

Ahogy telnek a hónapok, István még jobban megpörgeti a dolgokat, már a view-ban megy ki az adatbázis felé, eldob mindenféle keretrendszert és projektről projektre egy egyre inkább hízlalt `isti_functions.php`-t hurcol magával. Mivel mostanra ő lett a legproduktívabb a fejlesztők közül, ezért a vezetés úgy dönt, hogy bizony, ideje lenne Pistánkat egy magasabb pozícióba helyezni. István Senior lesz. Az új munkakör pedig új felelősséggel is jár, mégpedig azzal, hogy az újonnan érkezett gyakornokok és juniorokat neki kell rampupolnia. A kis zöldfülűeket leülteti a gép elé, megnyitja az IDE-ben az egyik már kész projektet és elkezdi mesélni, hogy pontosan mit is csinálnak az egyes függvények az `isti_functions.php`-ben. *A srácok itt tanulják meg, mit is jelent az a legacy kód.*

Azonban István változásra vágyik, így továbblép egy másik céghez. Ez a cég nem kis oldalakra, hanem nagyobb webalkalmazásokra specializálódott, ahol egy terméket illetve annak a komponenseit fejlesztik már évek óta. István az onboarding alatt hallgatja a kolléga beszédét arról, hogy pontosan milyen folyamatokon át megy egy-egy feladat/hibaticket:

- Lefejleszted a kódot. Ami kódhoz nincsenek tesztek, az olyan, mintha a kód se lenne.
- Ha ez megvan, hívsz egy tesztelőt és vele együtt is átnézitek egy kis demo keretében, hogy minden eshetőséget lefedtél-e.
- Ha kész vagy, csinálsz róla pull requestet és szólsz, hogy nézzünk rá. Neked is kell más kódját review-zni!
- Ha kijavítottad a dolgokat, megvitattatok mindent és elfogadták a pull requestet, akkor lehet csak bemergelni.
- A sprint 15%-át, ha tudod fordítsd tech debt-re.

A hallottak sokként érték Istvánt, hiszen ez a szöges ellentéte annak, mint amit eddig csinálnia kellett. A kódbázis hatalmas volt, százával gyűltek az osztályok, viszont minden publikus interfész, osztály dokumentálva volt, nem volt két különböző formázású fájl. A review során rengeteg újdonságot hallott vagy épp látott, mikor más kódját vizsgálta. Hetente tartottak kis csapatos coding dojo-t, ahol az IDE minden csínját-bínját ellesték egymástól.

Az előrelépés sem a leszállított ticketek alapján történt, a mennyiség itt nem kárpótol a minőségért, hiszen a kódbázist fent kell tartani, ha gyűlik a szenny, az később egyre jobban fájni fog és ezzel, ha nem is ismerték be egymás közt, a menedzserek is tisztában voltak. Ez az a fajta legacy kód volt, ami nem gány, csupán öreg, de a sorozatos refaktorálások alkalmával már-már alig akadt olyan része, amit ne gyúrtak volna kicsit át.

Vegyünk egy másik példát.

Van egy kódbázis, ami ősöreg PHP-ben íródott, közel 10 éve. Akkoriban jött be a JSON kiterjesztés az 5.2-es PHP-val, azonban a hosting szolgáltatók akkor sem voltak mások mint most, lassan tértek át újabb verziókra.

Találkozunk ezzel a kóddal és a sírás kerülget, mert látunk egy olyan függvényt, ami kézzel rak össze JSON stringet. Hát mégis mi a???? [![](assets/uploads/2015/08/kitty_rage_quit_table_flip_by_shadethenighthunter-d6qs9le.jpg)](assets/uploads/2015/08/kitty_rage_quit_table_flip_by_shadethenighthunter-d6qs9le.jpg)Utána nézzük a docblockot a fájl tetején:

```
Date: 2006.02.11
```

Utánaszámolunk, megnézzük a php oldalát és látjuk, hogy bizony akkor a legújabb, 5.2-es verzióban volt csak kint a json\_encode/decode (és a 4-es PHP még ment!). Ezután esetleg abba is belegondolunk, hogy most is akadnak olyan szolgáltatók, ahol 5.5-ös vagy inkább régebbi PHP van fent és máris más színben tűnik fel a dolog.

Ellenben ha ez a kódrészlet tavalyi lenne, akkor igencsak megkérdőjeleznénk az illető PHP ismereteit. A PHP fejlesztői is azon dolgoznak, hogy minél inkább kibővítsék a rendelkezésre álló eszközkészletet és ezzel hatékonyabb munkát tegyenek lehetővé, így a régi kódoknál ne lepődjünk meg, ha pl. 10 éve nem használták a Java 8 adta lehetőségeket, vagy épp nem volt JSON encode, ha .NET 2.0-t használunk.

A PHP fejlesztés eléggé speciális a tekintetben, hogy elég sokan vannak egyéni vállalkozók, ahol a kulcsszó az 'egyéni'. Ahogy korábban is említettem, ha az ember egyedül dolgozik, akkor ellustul, hanyag lesz, nem lesz kényszer arra, hogy betartson szabályokat, elveket.

Mit tehetünk, hogy mi ne hagyjunk hátra szörnyetegeket?

- Ha a céged nem tartja fontosnak a kódminőséget, akkor lépj le vagy kalkuláld bele a becslésekbe és ne hagyd, hogy befolyásoljanak ebben. Elvek!
- Dolgozz össze másokkal. Ha már ott vagytok egy rakáson, tanuljatok egymástól. A másik lehet tud valami olyan billentyűkombinációt az IDE-ben, netán olyan API hívást, amiről gőzöd sincs.
- Ha a munkaidőben nincs lehetőség összedolgozni, akkor járj el Coding Dojora, netán szervezz egyet a melóhelyen belül.
- Open-source! Ha főleg egyedül dolgozol, akkor egy githubos projektbe behuppanva lehetőséged nyílik másokkal összedolgozni, hogy tanuljatok egymástól.

Viszont a legfontosabb tanulság: **Nem kell egy kódnak réginek lennie ahhoz, hogy sírva fakadj tőle**.