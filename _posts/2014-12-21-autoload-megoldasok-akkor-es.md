---
id: 1679
title: 'Autoload megoldások akkor és most'
date: '2014-12-21T18:42:46+01:00'
author: tacsiazuma
layout: post
guid: 'http://iacwebshop.hu/?p=3'
permalink: /2014/12/21/autoload-megoldasok-akkor-es/
dsq_thread_id:
    - '3348543900'
    - '3348543900'
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
    - Intermediate
    - PHP
tags:
    - autoload
    - php
    - psr-0
    - spl
---

Az objektumorientáltság a PHP nyelvben is magával hordozta azt a tényt, hogy webalkalmazásaink egyre nagyobbra nőnek, és ahogy több és több könyvtárat használunk programunkhoz, az

```
<pre data-language="php">require(), include()
```

blokkok is gyarapodnak.

### Ennek orvoslására

a PHP nyelvben az 5.0-ás verzió hozta magával az \_\_autoload() mágikus függvényt.

Ezzel a függvénnyel és a beleprogramozott logikával könnyebbé tudtuk tenni az életünket, de persze csak egy bizonyos fokig. A függvény akkor hívódik meg, mikor futásidőben olyan osztályt, interfészt használtunk fel, amit előzőleg nem deklaráltunk. Ez egyfajta utolsó esély volt, hogy ne szálljon el hibával a program.

```
<pre data-language="php">function __autoload($className) {
      $className = $className . ".php";
      if (file_readable($className) {
         include($className);
      }
}
```

Ez akkoriban egy nagy segítség volt, ellenben ennek is megvan a hátránya. Mégpedig az, hogy csupán egyetlen autoloadert lehet definiálni, így vagy annak kell univerzálisnak lennie, vagy egy adott szisztéma szerint kellett elrendezni a fájljainkat (pl. minden osztályt egy class.{osztálynév}.php-fájlban tároltunk a classes mappában). Ez kis projektek esetében járható út, ellenben egy komoly framework esetében nehezebben kivitelezhető, ráadásul nem tudhatjuk, hogy a könyvtárak amikat használunk, milyen szisztémát követnek.

#### Az 5.1.2-es verzióban

az SPL könyvtárral jöttek az

```
spl_autoload(), spl_autoload_register()
```

függvények. Ez utóbbival lehetőségünk nyílt arra, hogy több, különböző autoloader függvényt regisztráljunk, melyeket azok regisztrációjának sorrendjében (paraméterekkel lehet változtatni) hív meg a program. A szintaxisa roppant egyszerű:

```
<pre data-language="php">spl_autoload_register("autoloadController"); // először az autoloadController nevű függvényt hívja meg 
spl_autoload_register("autoloadModel"); // utána pedig az autoloadModel nevűt
```

Vigyázat, amint regisztráltunk egy autoloader függvényt, vagy akár csak paraméterek nélkül meghívtuk a register-t, onnan kezdve a beépített `__autoload` függvény nem hívódik meg.

Mielőtt a PHP 5.3-as verziójával bevezették a névtereket, a fejlesztők különféle módszerekkel próbálták áthidalni az osztályok/függvények ütközését. A PEAR Coding Standard például aláhúzásokat alkalmazott, hogy osztályaik eléréséi útját prefixként hozzáfűzze azok nevéhez. Így a Zend\_Adapter osztályt a Zend/Adapter.php-ben találtuk. Az autoloader egyszerűen lecserélte az aláhúzásokat és úgy fűzte hozzá a fájlt a kódhoz.

#### A PSR-0 szabvány

2009-ben egy csapat a PHP közösségből megalakította a PHP Standards Working Group-ot és megalkották a PSR-0 szabványt, aminek a célja az volt, hogy lefektesse azokat a szabályokat, amik a különböző könyvtárak autoloaderjei közti inkompatibilitást hivatottak áthidalni.

Alább álljanak a PSR-0 feltételei:

- Egy névtérnek és osztálynak a következő struktúrát kell követnie: <Gyártó>(<Névtér>)\*<Osztály>
- Minden névtérnek kell lennie egy legfelső szintű névtere ("Gyártó").
- Minden névtér-elválasztót könyvtár elválasztóvá alakítanak, mikor a rendszerbe betöltik azt.
- Az osztály nevében szereplő aláhúzásokat szintén könyvtár elválasztóvá alakítják, ellenben ez nincs kihatással a névterekre.
- A névtér és osztály struktúrája ".php"-végződésű, mikor a rendszerbe betöltik azt.
- A kis és nagybetűk bármilyen kombinációban előfordulhatnak a gyártó, a névtér és az osztályok nevében.

Mit is jelent mindez? Azt, hogyha a jövőben a saját kis könyvtárunkon dolgozunk, akkor érdemes figyelembe venni a fent leírtakat, írni rá egy autoloadert, amit aztán a komolyabb framework-ökbe való implementálás esetén el is lehet hagyni, hisz azoknak ez már részét képezi. Ezzel megkönnyíthetjük a saját dolgunkat, hiszen elkerülhetetlen, hogy ne dolgozzunk Zend/Symfony vagy a többi nagy keretrendszer valamelyikével a jövőben és ott már csak bemásoljuk a megfelelő fájlokat a könyvtárstruktúrából, az adott fájlok elejére írjuk a

```
<pre data-language="php">use SajatKonyvtar\SajatCsomag\SajatOsztaly;
```

sorokat és máris kész vagyunk, mert a PSR-0 szabványt követő autoload megoldja a többit helyettünk.