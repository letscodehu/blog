---
id: 397
title: 'Composer &#8211; A PHP fejlesztők kedvenc zeneszerzője'
date: '2015-03-12T18:24:50+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=397'
permalink: /2015/03/12/composer-a-php-fejlesztok-kedvenc-zeneszerzoje/
dsq_thread_id:
    - '3592857470'
    - '3592857470'
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
    - autoload
    - dependency
    - management
    - namespace
    - package
    - packagist
    - php
    - require
---

Van egy mondás, miszerint az okos/rutinos programozó nem fogja újra és újra feltalálni a kereket, hiszen az teljesen felesleges időpocséklás lenne, hanem leakaszt egy már meglévő library-t a polcról és azt használja, megkímélve magát a sok vesződségtől (vagy épp ezzel generálva azt, de most nem [személyeskedünk](http://wordpress.org), igaz?).

[![ludwig-van-beethoven-a-great-composer1](assets/uploads/2015/03/ludwig-van-beethoven-a-great-composer1.jpg)](assets/uploads/2015/03/ludwig-van-beethoven-a-great-composer1.jpg)  
Ha így járunk el, akkor a program, amit készítünk, függ ettől a leakasztott libtől. Ezt nevezik dependenciának, hogy egy kellően gusztustalan idegen eredetű szóval éljek.  
Ha netán open-source dolgokba bonyolódunk, akkor ezt a külső libet nem fogjuk projektünkhöz mellékelni, hanem a dokumentáció elejébe beírjuk, hogy bizony az e-mail küldéshez kell a PHPMailer 5.2.x vagy újabb, mert mi azzal összeteszteltük és funktzioniert.

Viszont ha mi okosak voltunk, akkor mások is lehettek azok és használhattak external library-ket a sajátjukhoz, amik szintén függtek más library-któl és így tovább, remélhetőleg nem a végtelenségig.

Ellenben kinyomozni és kézzel leszuttyogni [packagist](http://packagist.org)-ról vagy épp ahonnan a megfelelő függvénykönyvtárakat macerás lehet. Ha pedig ezzel megvolnánk, akkor egy újabb problémába ütközünk.

##### PSR Standard

Aki olvasta az ide tartozó [cikket]({{ site.url }}/2014/12/21/autoload-megoldasok-akkor-es/ "Autoload megoldások akkor és most"), annak nem lesz teljesen kínai amiről szó lesz. Tegyük fel, hogy letöltöttük a PHPMailert és az Amqp-lib-et, mert mindkettőre szükségünk lesz, ugyanis e-mail küldést akarunk egy queue-ról megvalósítani. Ez mind szép és jó, de ezeket a php fájlokat valahogy el is kellene érjük. Az include parancsot a PHP 5.3-as verziója óta kissé outdated használni osztályok elérésére, a szimpla autoloadereket felkonfigurálni pedig nem 1 perc lesz, hogy elérjük a látszólag össze-vissza könyvtárnevekkel érkező fájlokat. Azonban már ahogy volt szó a fent említett cikkben, az autoloaderekből többet tudunk regisztrálni, különféle szabályok szerint és létrehoztak erre egy ún. standardot, amit a packagist-ről érkező external library-k követnek (és nekünk is ajánlott, ha kódunkat megosztjuk az open-source közösséggel). Ez pedig azt jelenti, hogy a fent említett Amqplib a projektünk gyökerén belül egy

```
/vendor/videlalvaro/Amqplib/
```

könyvtárban fog helyet foglalni.

Na most ahhoz ,hogy ezen belül elérjük a fájlokat, egy újabb szabályt/classmapot kellene belőni, amitől mi most megkíméljük magunkat, sőt!

##### Composer[![harry-potter-ralph-fiennes-voldemort-actors-1660153-1920x1080](assets/uploads/2015/03/harry-potter-ralph-fiennes-voldemort-actors-1660153-1920x1080-1024x576.jpg)](assets/uploads/2015/03/harry-potter-ralph-fiennes-voldemort-actors-1660153-1920x1080.jpg)

Aki <del>járatos a komolyzenében</del> húzott már fel Zend skeletont, annak nem lesz idegen ez a bekezdés. A composer egyfajta "csomagkezelő", hasonló ahhoz, mint amit pl. a linux használ, de ez PHP-re és PROJEKTRE specifikus, ennélfogva semmit sem fog "globálisan" telepíteni. Kezeli a különböző csomagjainkat, azok függőségeit.

Mégis hogyan? Ahhoz, hogy ezt kitapasztaljuk, először is le kell töltsük azt projektünk gyökerébe [innen](https://getcomposer.org/download/):

Ha ezzel megvolnánk, akkor ott vár bennünket egy composer.phar nevű fájl.

> PHAR: PHP archívum. A PHAR kiterjesztéssel bele is kukkanthatunk php-ből. Egy programot foglal egybe és a tömörítés ellenére futtatható.

Ha most beírjuk a következőt:

```
<pre data-language="shell">php composer.phar install
```

akkor legnagyobb elkeseredésünkre nem történik semmi, mivel szerencsétlen composer világát nem tudja így frissen letöltve, úgyhogy némi segítségre szorul, végülis nem csodaszerről van szó. Ahhoz, hogy tudassuk a mi projektünknek a függőségeit, el kell helyeznünk annak gyökerébe egy composer.json fájlt, amiben deklaráljuk azokat:

```
{
             "require" : { // itt deklaráljuk, hogy nekünk bizony az alábbi csomagok kellenek
                     "phpmailer/phpmailer" : "5.2.*", // ez pedig az 5.2-es verzióval kezdődő Phpmailereket. 
                     "videlalvaro/php-amqplib": "2.4.*@dev" // ez a 2.4.x-dev verziószámú php-amqplib-eket fogja letölteni
             } 
}
```

A json formátum gondolom senkinek se lesz idegen, aki webfejvesztésre adta a fejét, így abba nem mennék bele, de jól látható, hogy egy objektumon belül deklaráltunk egy újabb objektumot, a require kulcs alatt és azon belül pedig az adott csomagnév/verzió kulcs-érték párokkal adjuk meg mire is van szükségünk.

Ha a fentit beleírtuk a composer.json fájlba, akkor az iménti install parancs hatására a composer letölti a fájlokat egy vendor könyvtárba és egy autoloadert is konfigurál a számunkra azok elérésére, amit /vendor/autoload.php-ként érünk el, ezt kell még include-olni kódunk elején és máris elérjük a szükséges external library-ket.

##### Csomagoljunk!

Miből áll egy csomagnév? A csomagnév két komponensű, az egyik az ún. vendor, a második pedig a konkrét csomag neve. Az esetek többségében ez megegyezik, mivel nem mindenki árasztja el a közösséget a csomagjaival, így csak 1 package tartozik hozzá, így ezek a vendorok igazából egyfajta névterekként az ütközések kiküszübölését szolgálják.

A verziószám is hasonlóan egyszerűen épül fel, többféle módja van a verziók megadásának.

Megadhatunk pontos verziót, pl. 1.1.1. Ha szeretnénk követni a minor fixeket, akkor a szemantikus verziózást követő csomagoknál használhatjuk a \* karaktert, ugyanis a composer felismeri a wildcard karaktereket és kezeli is őket, így pl. az 5.2.\*-re lejöhet az 5.2.1, 5.2.0, de az 5.2.35 is (természetesen a lehető legújabb közülük)

Megadhatunk tól-ig értékeket is a következő módon: >= 1.1 < 2.0. Ezesetben az 1.1.0-tól felfelé jöhet minden, viszont a 2.0 verzió már nem. Ez hasznos lehet, ahol a 2.0 megtörné a kompatbilitást.

Hasonló célt szolgál a ~ operátor is. Az ~1.1 operátor az utolsó megadott számjegyet engedi felfelé, így ugyanaz, mint a >=1.1 < 2.0. A ^ operátor is hasonlóképp működik, de sosem engedi a kompatibilitást megtörő update-eket.

Alapesetben a composer csak a stabilnak ítélt release-eket fogja letölteni a számunkra, ha a bétákkal és egyebekkel is szeretnénk foglalkozni, akkor ezt külön meg kell adjuk.

##### Lock-et of the Iron Solari

Amikor a composer install-al feltelepítjük a függőségeket, a telepítés gyökerében keletkezik egy composer.lock fájl is. Ha verziókezeljük a projektünket, ezt a fájlt mindenképpen adjuk hozzá, mivel ebben a fájlban tárolja a composer a letöltött függőségek KONKRÉT verzióját és ha ez a fájl is megtalálható, akkor ez alapján fog dolgozni, nem pedig json fájl alapján.

Ez azért fontos, mert ha ezt kihagyod, akkor akik rajtad kívül dolgoznak egy projekten, ők a json fájl alapján más verziókat tölthetnek le, ennélfogva lehet náluk nem fog úgy működni az alkalmazás, mint nálad, Te pedig nem fogod tudni, hogy mégis hol és mit b\*sztam el?

##### Aranybánya

A packagist.org weboldal képezi a fő tárolóhelyét a composer által biztosított csomagoknak, ennélfogva bármi amit ott megtalálsz beírhato a json fájlba.

Ugye már szóba került, hogy autoloadereket is generál, ha a csomagról van ilyen információ. Ha a saját fájljainkat is fel szeretnénk venni, akkor ezt is megtehetjük és így azokhoz is legenerálja az autoloader konfigurációt.

```
{
       "autoload" : {
             "psr-4" : {
                 "System\\" : "trollfarm/"
              }
       }
}
```

Ez alapján a composer regisztrál számunkra egy PSR-4 standardnak megfelel autoloadert és a System névteret a projektroot/trollfarm/ mappába irányítja. Tehát a System\\Class osztályt a projektroot/trollfarm/Class.php-ben fogja keresgélni a számunkra.

Egyelőre ennyi legyen elég a composerről, akinek még kérdése van annak ajánlom a hozzászólások és atomrakéta funkciót lentebb!