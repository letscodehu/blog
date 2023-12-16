---
id: 89
title: 'PHP OOP &#8211; mielőtt bármibe kezdenénk'
date: '2015-01-08T21:39:57+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=89'
permalink: /2015/01/08/php-oop-mielott-barmibe-kezdenenk/
dsq_thread_id:
    - '3404752729'
    - '3404752729'
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
    - access
    - class
    - modifier
    - php
    - static
    - this
---

Rövidke PHP-s fórumokon lebzselő pályafutásom alatt a legtöbb kérdés az objektum-orientált programozás témaköréből került ki és, habár száznál is több oldalt lehet találni az interneten, talán ez a cikk lesz az, amelyik átlendíti az illetőt a palánkon és felnyitja a szemét, hogy mindez nem is akkora ördöngősség.

Először is szeretném leszögezni, hogy nem attól lesz valami objektum-orientált, mert vannak csináltunk egy `adatbazis (<del>szeretjük</del> a magyar elnevezéseket, ugye?)` osztályt, azt példányosítottuk és ezen keresztül meghívjuk a mysqli függvényeket, viszont aki teljesen új a témában, azok számára muszáj mindent az elejéről kezdeni.

#### What is class? <del>Baby don't hurt me</del>

Az objektumorientált programozásban az osztályt úgy kell elképzelni, mint egy öntőformát, egy tervet, ami tervnek a megvalósítása lesz az osztály egy példánya, ami egy objektum. Definiálni minden nyelven roppant egyszerű, de maradjunk a PHP-nál:

```
<pre data-language="php">class adatbazis {} // továbbra is <del>imádjuk</del> a magyar elnevezéseket
```

Bumm, meg is volnánk, de jelen esetben nem tudunk vele túl sokat kezdeni, hiszen ez csak egy terv, le kell gyártanunk a terv alapján valamit:

```
<pre data-language="php">$db = new adatbazis();
```

A kulcsszó esetünkben a `new` szócska lesz, tehát egy új példányt kérünk, ami azt takarja, hogy meghívódik az osztályunk `__construct` (vagy épp ami a nyelv sajátja) nevű mágikus függvénye (esetünkben ez nincs definiálva), elvégzi az általunk definiált prekonfigurációt és visszaad egy példányt az osztályból. Tehát a $db nem az osztályra, hanem az abból példányosított objektumra hivatkozik. Más módon közvetlenül az osztályra nem lehet hivatkozni, csak annak statikus elemeire, de erről picit később.

#### Példányváltozók

Ha már van egy objektumunk, akkor annak lehetnek tulajdonságai is, amik az adott példányra jellemzőek.

```
<pre data-language="php">class Wallet {

      private $cash;
      private static $staticCash;

      public function __construct($cash) {
          $this->cash = (int) $cash;
      }
      public function getCash() {
          return $this->cash;
      }
      public function setCash($cash) {
          $this->cash = (int) $cash;
      }
}
```

A fenti kód egyeseknek már a könyökén jöhet ki, de azért nézzünk rá. Először példányosítsuk ezt is:  
$wallet = new Wallet(5000); // amit a zárójelek közé teszünk azt igazából a konstruktorunk kapja meg, így csináltunk 1 pénztárcát, aminek megadtunk, hogy bizony 5000 akármi legyen rajta.

A `$this` kulcsszó az objektumra önmagára utal. Vagyis amikor a $this szócskát használuk, akkor az épp aktuális példányra hivatkozunk vele. Tehát a konstruktor csak beállítja a saját $cash változó értékét. Az objektumok tagfüggvényeire és változóira a `->` használatával tudunk hivatkozni.

Tehát az objektumhoz tartozó $cash változót megkaphatjuk a `$wallet->cash` hivatkozással. Viszont az nem szép gyakorlat, ha az objektumok változóinak csak így adunk értéket, mivel később rengeteg lesz belőlük és ha valahol elírás van, ember legyen a talpán aki megtalálja, hogy hol is változott az értéke. Ennek megfelelően és az [open/closed elveket ](http://en.wikipedia.org/wiki/Open/closed_principle)vallva setter/getter metódusokat használunk, de erről is picit később.

#### Mi az a static?

Az előbbi példában lehetett találni egy kulcsszót, amiről nem esett szó, ez pedig a `static`. Ennek a kulcsszónak a beiktatásával lehet elérni, hogy az adott változó/metódus az osztályhoz tartozzon és ne az osztály példányához. Ezekre nem lehet a `$this->` módszerrel hivatkozni, mivel ezek nem a példány részei.

A hivatkozás static esetében az alábbi módon történik:

```
<pre data-language="php">Wallet::$staticCash
```

tehát az osztály nevét használjuk. Az osztályon belül, akár a példányokon át is hivatkozhatunk rá, ellenben ekkor a `$this->` módszer statikus "átiratát" kell használnunk, így kerül képbe a `self::$staticCash`.

A statikus változók és függvények akkor is rendelkezésre állnak, ha az osztályt előtte nem példányosítottuk (és be is töltődnek a memóriába, ezáltal óvatosan kell velük bánni).

#### Access modifiers

Az imént szóba került, hogy ajánlott meggátolni azt, hogy az osztályunk értékeit kívülről piszkálják. Ennek az orvoslására vannak az ún. access modifier-ek, ami a mi példánkban is szerepel.

Ha a fenti kódot használnánk és hivatkoznánk a `Wallet::$staticCash` változóra, akkor egy hibát dobna a parser, miszerint private property. Három access modifier van, ezek közül az alapértelmezett a `public`, amikor mindenki kénye kedvére átírhatja az osztályunk/példányainak változóit. A másik opció, a már említett `private`, amikor csak az osztály(és/vagy annak példányai) képes hozzáférni az adott változóhoz. A harmadik opció pedig a `protected`, amikor csak az osztály és az abból származtatott osztályok képesek hozzáférni az adott változóhoz.

> Az access modifierek függvényekre is érvényesek, azok meghívását gátolhatják.

Ahhoz, hogy az osztály elemei kívülről is elérhetőek legyenek alkalmazunk public setter és getter metódusokat, amikben pl. ellenőrízhetjük, hogy ki kéri az adott változót és jogosult-e rá, netán a setter esetében ellenőrízhetjük, hogy a kapott érték megfelel-e. A fenti példában is alkalmazunk ilyeneket, a setCash és getCash függvényeket (PHP-ben létezik erre egy `__set()` mágikus függvény is).

Első nekifutásra ennyire futotta, a következő körben belenyalunk az absztrakt osztályok és interfészek világába, na meg megnézzük, hogy mégis mit lehet ezekkel az objektumokkal kezdeni.