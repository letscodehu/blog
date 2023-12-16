---
id: 79
title: 'Keresőoptimalizálás másképp &#8211; OPcache'
date: '2015-02-01T20:26:25+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=79'
permalink: /2015/02/01/keresooptimalizalas-maskepp-opcache/
dsq_thread_id:
    - '3476026706'
    - '3476026706'
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
    - Egyéb
    - Intermediate
    - PHP
tags:
    - '5.5'
    - cache
    - compile
    - extension
    - opcache
    - php
---

Aki valaha elmélyült a keresőoptimalizálásban az tudja, hogy rengeteg buktatója van a dolognak és a kedves Google valamikor úgy döntött, hogy ezt az optimalizálási folyamatot egy újabb tényezővel megfejeli: immáron a találatok súlyozásába az oldal betöltődési sebessége is beleszámít.![speedlimit](assets/uploads/2015/02/speedlimit-1024x640.jpg)

> Figyelmeztetés: A cikk ( mint ahogy a címéből is kiderülhet) PHP oldalról közelíti meg a problémát, így a JSP, C# fanoknak nem sok örömet fog okozni 🙂

Most, hogy a statikusan típusos nyelvek megszállottjai elmentek, nyugodtan beszélhetünk a PHP 5.5 egy "új" (a PECL kiterjesztésben 5.2 óta megtalálható) beépített funkciójáról, az OP(code) cache-ről.

> Miféle gyorsítótárazási megoldás ez?

Amint majd egy későbbi cikkemben leírom, a webalkalmazások gyorsítótárazásnak több rétege létezik, a jelenlegi egy szerveroldali, alkalmazáson felüli módszer. A PHP ugye egy interpreted nyelv, tehát amikor kérés érkezik a webszerverünk felé, akkor fog a kódunk lefordulni. Aki már látott belülről fordítóprogramot az tudja, hogy ez a folyamat több lépésből áll és még egyszerűbb nyelvek esetében sem nevezhető sétagaloppnak. A scanner egyesével benyeli a karaktereket a fájlban, majd a lexical analyzer (lexer) tokeneket képez belőle és ezeket a tokeneket... hosszú.

Ugye egy apró pár ezer soros webalkalmazás esetében a jelenlegi számítási teljesítmények mellett ez nem tétel, ellenben akadnak bizony nagyobb falatok is (pl. a facebook a maga szolid 30 millió kódsorával, ahol egy-egy checkouttal 59 gigát mozgatunk meg), ahol bizony nem mindegy, hogy ez a fordítás már megtörtént vagy még most kezdünk a HDD-n ide-oda ugrálva kb. 0%-os buffer kihasználtsággal olvasni, vagy a memóriában ott a készétel, amit csak tálalni kell (bár a facebook egy más tészta, a HHVM miatt).

Pont ennek a problémának a kiküszöbölésére hozták létre anno a PECL-es srácok az opcache kiterjesztést a PHP nyelvhez, ami egy lépéssel közelebb hozza a compiled nyelvek sebességéhez a nyelvünket.

> Ráizgultam, mit kell tennem?

A telepítése a PHP 5.5 vagy újabb verziójával roppant egyszerű (ami remélhetőleg mindenkinél adott, legalább a dev környezetben, ugye?:)

A php.ini fájlban a

```
zend_extensions=opcache.so
```

sort kell kikommentelnünk és amint újraindítottuk a webszerverünket, a kiterjesztés már él is. Akinek régebbi PHP verziója van (de legalább 5.2) az a PECL kiterjesztéseknél keresgéljen, [itt](http://php.net/manual/en/install.pecl.php).

Na, most hogy már elérjük az ide tartozó funkciókat, akkor nézzük át a dolgot.

A leggyakrabban használt funkció `opcache_compile_file `lesz, ami leginkább az include-hoz hasonlít, azzal az eltéréssel, hogy csak lefordítja a fájlt, de nem hajtja végre annak tartalmát és egy hozzá tartozó kulcsban tárolja, mint egy key => value szerver. Mikor legközelebb include-olnánk azt a fájlt (autoloaderrel vagy bárhogy), akkor először a cache-ben fogja automatikusan ellenőrízni az adott kulcsot, így ezzel a felével már nem kell törődnünk. Alább látható egy php.net-ről csent kis kódrészlet, amivel egy adott könyvtár tartalmát cache-lhetjük le rekurzívan.

```
<pre data-language="php">function getfiles( $path , &$files = array() ) {
    if ( !is_dir( $path ) ) return null;
    $handle = opendir( $path );
    while ( false !== ( $file = readdir( $handle ) ) ) {
        if ( $file != '.' && $file != '..' ) {
            $path2 = $path . '/' . $file;
            if ( is_dir( $path2 ) ) {
                getfiles( $path2 , $files );
            } else {
                if ( preg_match( "/\.(php|php5)$/i" , $file ) ) {
                    $files[] = $path2;
                }
            }
        }
    }
    return $files;
}
$files = getfiles('/path/to/our/php/files/');
$br = (php_sapi_name() == "cli") ? "\n" : "
";
foreach($files as $file){
  opcache_compile_file($file);
  echo $file.$br; 
}
```

`opcache_invalidate `- ezzel tudjuk invalidálni az adott fájlhoz tartozó scriptünket, mint a többi cache-lési megoldás esetében.

`opcache_get_status `- Ez a függvény visszaadja a opcache service adatait, úgy mint a rendelkezésre bocsátott memória állapotát, a kulcsok kihasználtságát, valamint egy tömbben megtalálható az összes tárolt kulcs és az ahhoz tartozó létrehozási dátum, utolsó elérés, valamint az általa foglalt memória.

`opcache_reset `- Ez a függvény töröl minden kulcsot a memóriából.

`opacache_get_configuration `- Ezzel a paranncsal tudjuk kinyerni az épp aktuálisan érvényben levő opcache konfigurációt.

Na de ha fellőttük, akkor mennyit is számít ez? Most nem fogok nagyon mélyen belemenni a benchmarkingba, így egy viszonylag egyszerű módszert, a [siege](http://linux.die.net/man/1/siege) nevű programot fogom használni. Ennek lényege, hogy egymással párhuzamos lekéréseket szimulál az adott címre és annak adatait értékeli ki. A program kimenete a következő lesz opcache nélkül (15 szimultán user 1 percen át):[![Uncachedsiege](assets/uploads/2015/02/Uncachedsiege.bmp)](assets/uploads/2015/02/Uncachedsiege.bmp)

> Megjegyzés: Ezt a programot ne használjuk production environmentben, mert nem egészséges.

Nos mit látunk? Ami számunkra fontos az az, hogy az availability 100%, a failed transactions pedig 0. Ha ezek megvannak, akkor a szolgáltatásunkkal nincs nagy baj, de hogy a gyorsítótárazás szempontjából vizsgáljuk a dolgot, a response time a lényeg. Ez az átlagos válaszidő, amit a user is tapasztalna. Ugye jelen esetben a siege mindenféle böngészős gyorsítótárazás nélkül vizsgálja az oldalak lekérdezését, így minden egyes elemet letölt, mintha most látogatná először az oldalt. Amint láthatjuk ez a 9 másodperc igencsak sok ( sok fájl, komplett wp motor, 8 bővítménnyel), úgyhogy most nézzük meg mi történik, ha bekapcsoljuk az opcache-t.[![Cachedsiege](assets/uploads/2015/02/Cachedsiege.bmp)](assets/uploads/2015/02/Cachedsiege.bmp)

Nos ezek a számok már azért sokkal szebben mutatnak. Ugyanaz az oldal, csak az összes fájl becachelve és így közel harmadára tudtuk csökkenteni az átlagos válaszidőt és mindez jelen esetben 32 megabájt memóriát igényelt szerver oldalon, amiben tároljuk a lefordított fájlok százait.