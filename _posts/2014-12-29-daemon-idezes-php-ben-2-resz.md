---
id: 64
title: 'Daemon idézés PHP-ben &#8211; 2. rész'
date: '2014-12-29T02:40:24+01:00'
author: tacsiazuma
layout: post
guid: 'http://iacwebshop.hu/?p=64'
permalink: /2014/12/29/daemon-idezes-php-ben-2-resz/
dsq_thread_id:
    - '3394547877'
    - '3394547877'
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
categories:
    - Advanced
    - PHP
tags:
    - cronjob
    - daemon
    - fork
    - oop
    - php
    - process
---

Előző cikkemben végigvettünk pár alapfogalmat, ami a daemonokkal és a processekkel kapcsolatos, de mindeddig nem derült fény arra, miért is érdemes PHP nyelven ebbe belefogni.  
Rengetegen programoznak PHP nyelven, sokkal többen, mint C nyelven, amiben az ilyen programok egyébként íródnak. Egy webfejlesztéssel foglalkozó cégnek egyszerűbb egy backend fejlesztőjének kicsit utánajárni a dolognak, mintsem C nyelven megtanulnia.

#### Mi értelme PHP nyelven háttérben futó alkalmazást írni?

> Ha akarok valamit a háttérben, arra ott a cronjob.

Igenám, de cronnal legsűrűbben percenként tudunk scriptet futtatni, ami pedig egyes esetekben nem elég, vagy ha igen, mi a helyzet akkor, ha ezek a processek tovább tartanak, mint egy perc és átfednek? Emeljük a tétet, az adatbázisba írnak/olvasnak.  
Így máris jobb színben tűnik fel egy háttérben futó alkalmazás, ami egy várólistáról csemegézik az elvégzendő lekérdezésekből, de garantáltan csak egyet fog lefuttatni egyszerre.

Most, hogy tisztáztuk az okokat, térjünk vissza a megvalósításra!

#### Start/stop

Mindenek előtt készíteni kell egy start/stop script-et, tehát a parancssoros alkalmazásunknak képesnek kell lennie az argumentumok feldolgozására. Az argumentumok a `$_SERVER['argv']` indexében vannak letárolva, azonban ezzel vigyázni kell, mivel minden különálló szó külön indexen lesz tárolva, tehát a script meghívásakor a fájlunk neve is.

Tehát egy `php phpdaemon.php start` esetében a tömbünk az alábbi módon néz ki:

```
<pre data-language="shell">```
[0] - "phpdaemon.php", [1] - "start".
```
```

Ennélfogva jobban járunk, ha array\_shift-el emelgetjük le az elemeket és preg\_match-al validáljuk azt (pl. '/--\[a-z\*\]/', "--start" esetén. ), így meggyőződve arról, hogy jó argumentumokat kaptunk-e. Az igazán fanatikusok parser-t is írhatnak ezekre a tokenekre, de ebbe most nem mennék bele mélyebben. Először nézzük milyen controller class-t lehet hozzá készíteni:

```
<pre data-language="php">class Controller {

 public function __construct() {
 // itt inicializáljuk a kontrollerünket, ki épp hogy. Elfogadhat argumentumokat, esetleg létrehozhatunk osztályt, ami előtte leparse-olja őket és command objektumokat készít, amit injectálhatunk ide, megnézhetjük, hogy van-e kellő jogosultságunk a working directory-ban, stb.
 }

 // indítsuk el a daemonunkat!
 public function start() {
    // ellenőrízzük, hogy létezik-e a PID fájl, ha igen, akkor hibaüzenet és exit.
    if (file_exists(PID_FILE)) {
     exit("Daemon is already running (PID file exists).");
    }
    echo "Starting the daemon...";
    $pid = pcntl_fork(); // a $pid változó függvényében folytatjuk tovább
    if ($pid == -1) exit("failure!\nCan't fork the daemon."); // nem sikerült a dolog
    elseif ($pid == 0) { // a háttérfolyamatban vagyunk, szóval annak megfelelően járjunk el
       $d = new Daemon();
       $d->run();
    } 
    else { // a szülő folyamat vagyunk, szóval hozzuk létre a PID fájlt, írjuk ki, hogy sikeresen elindultunk (esetleg a PID-t hozzá.)
       echo "success! (PID:$pid)";
       file_put_contents(PID_FILE, $pid);
    }
 }
 // lőjük le a daemonunkat
 public function stop() {
    $pid = file_get_contents(PID_FILE);
    posix_kill($pid, SIGTERM); // sigterm (15) signalt küldünk a processünknek
    posix_kill($pid, SIGKILL); // sigkill (9) signalt küldünk a processünknek
 }
}
$ctl = new Controller();

// itt szűrjük ki az argumentumokat és annak megfelelően hívjuk meg a start vagy épp stop metódusát

$ctl->start(); // először nézzük meg mit is teszünk indításkor.
```

Most pedig nézzük meg, hogy is néz ki a daemon-unk belülről:

```
<pre data-language="php">class Daemon {
     public function __construct() {
     pcntl_signal(SIGTERM, [$this, 'signalHandler' ] ); // regisztrálunk egy signal handlert a SIGTERM-re, mivel a SIGKILL-re nem lehet, itt minden esetben a default handler fut le
     }
     public function signalHandler($sigNo) {
     // a $sigNo függvényében csinálunk valamit
     }
     // az általunk meghívott run metódus
     public function run() {
         // végtelenített ciklus
         while(true) {
             // ide jöhet minden, amit a programunk csinálni akar
             sleep(2); // mindenképp iktassunk be sleep-et a while ciklusba, különben megeszi a processzorunkat
         }
     }
}
```

Nézzük végig mit is csinál a fenti kód. Példányosítja a controller osztályunkat, a konstruktor lecsekkolja, hogy a PID fájl létezik-e, ha igen, akkor már fut a daemon, szóval exit. Ezután meghívjuk a start metódusát.

Itt végezzük a konkrét forkolást, tehát a két folyamat ezen a ponton válik szét. Jól látható, hogy a gyermek process példányosítja a daemon-t, kijelöli a signal handler metódusokat és végül meghívja annak run metódusát (amiben egy végtelenített ciklust helyeztünk el).

A szülő process kiírja a PID-t és véget is ér a futása. Ha a stop metódust hívnánk meg, az a PID fájlból kinyeri a gyermek process-ünk PID-jét és sigterm, majd sigkill szignálokkal kilövi azt.

Amikre ügyelni kell:

1. Végtelenített ciklusok esetén MINDIG legyen sleep(), különben megeszi a processzorunkat.
2. Mivel háttérfolyamatról van szó, semmiféle outputot nem szabad produkálni. Mindent fájlokba írjunk, méghozzá úgy, hogy a kimeneteket (STDOUT,STDERR) átirányítjuk fájlokba, ezáltal szemmel tartható, ha valami gond van, valamint azt is elkerüljük, hogyha valami hiba beüt, akkor szétspammelje a program a bash-t.

A következő részben szó lesz a memory leakingről/garbage collectionről, uid-gid beállításról, utána (ahogy az időm engedi és a többi cikkel is haladok), írunk egy "webszerver-t", ami mindennek tetejében (ha már adott :D), php értelmezőt is futtat majd.