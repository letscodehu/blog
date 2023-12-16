---
id: 368
title: 'Kincs, ami nincs &#8211; 2. rész'
date: '2015-03-06T00:16:38+01:00'
author: tacsiazuma
excerpt: R
layout: post
guid: '{{ site.url }}/?p=368'
permalink: /2015/03/06/kincs-ami-nincs-2-resz/
dsq_thread_id:
    - '3571998144'
    - '3571998144'
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
    - Backend
    - Database
    - NoSQL
    - PHP
tags:
    - mongodb
    - nosql
    - php
---

Az [előző]({{ site.url }}/2015/03/03/anulu-elete-pongo-mongodb-szigeten/ "Anulu élete Pongo-MongoDB szigetén") cikkemben volt szó arról, hogy mi is alapjában véve a MongoDb és milyen flexibilitást nyújt, ellenben arra nem tértem ki, hogy is tudjuk ezt fellőni. Aki türelmetlen és nem akar vesződni a [![koala](assets/uploads/2015/03/koala1.jpg)](assets/uploads/2015/03/koala1.jpg)[felületén](http://try.mongodb.org) ki tudja próbálni azt. Most viszont arról lesz szó, hogy tudjuk PHP alatt működésre bírni a rendszert és ha ez megvolt, akkor az alap parancsokkal és visszatérési értékükkel fogunk foglalkozni.

Ha PHP alatt akarjuk felerőszakolni a dolgot, akkor két lehetőség áll előttünk. Az egyik ha a Pecl kiterjesztéseken keresztül tesszük meg ezt.  
Ehhez a terminált nyissuk meg (igen, ismét gonosz linuxos példákon át mutatom be a dolgot) és ha szerencsénk van, már fel is raktuk valamikor közvetve a pecl kiterjesztést, aminek egy saját package manager részét fogjuk használni.

```
<pre data-language="shell">pecl install mongo
```

(a phpize packagere lehet szükségünk lesz, ezt a php5-dev csomaggal tudjuk magunkévá tenni)  
Ha feltelepült, akkor már csak a php.ini fájlban kell hozzáadni a következő sort:

```
extension=/abszolut/eleresi/ut/mongo.so
```

Ezután csak újra kell fingatni az apache-ot és a phpinfo() ki is böki ha sikerrel jártunk.

A másik megoldás egy fokkal bonyolultabb, abban az esetben fel kell szuttyogjunk githubra és onnan letölteni [ezt](https://github.com/mongodb/mongo-php-driver). Csomagoljuk ki, terminálban lépjünk a könyvtárba ahova ezt tettük és

```
<pre data-language="shell">phpize
./configure && sudo make && sudo make install
```

Ezután az előbbi módszerhez hasonlóan írjuk bele a php.ini fájlba az elérési útját és indítsuk újra az apache-ot.

> Ha ezzel megvolnánk, akkor nincs más hátra, zuhanjunk neki.

A legelső, hogy felcsatlakozunk a MongoDb service-re. Ezt pedig a MongoClient osztállyal tudjuk megoldani.

```
<pre data-language="php">$pongo = new MongoClient(); // ugyan nem adtunk át neki semmit, mégis működni fog, mivel alapjáraton van annyi esze, hogy localhoston nézi a default portot, ami nekünk épp kapóra jön
$testdb = $pongo->selectDB('test'); // ezzel tudunk a test database-hez csatlakozni, amit alapjáraton létre is hoz a telepítő
```

Innen kezdve hasonló a helyzet, mint SQL-nél, itt kijelöltük a DB-t, azon belül a collectionöket kell mostmár elérnünk, amik az SQL táblákkal egyenértékűek.

```
<pre data-language="php">$collection = $testdb->selectCollection('collectionNeve'); // ilyen módon tudunk kijelölni egy adott collection-t, innen kezdődhet bárminemű betyárkodás
```

#####  "CREATE TABLE"

Kollekciókat a következő paranccsal tudunk létrehozni:

```
<pre data-language="php">$testdb->createCollection('iLoveSql'); // ezzel az egyszerű paranccsal létre is hozhatjuk a collection-t, mint már említettük, flexibilisek vagyunk, ezért nem kell fieldeket definiálni és hasonlók, persze második paraméterként elfogad ez is opciókat
```

##### "DROP TABLE<del> grades</del>"

A collection-ök ugyanilyen könnyedséggel törölhetőek:

```
<pre data-language="php">$testdb->dropCollection('iLoveSql');
```

##### "INSERT INTO"

Akkor adjunk hozzá valamit a világhoz:

```
<pre data-language="php">$collection = $testdb->selectCollection('iLoveSql'); // ezeket a parancsokat egy már kijelölt collection-ön tudjuk végrehajtani, nem pedig az adatbázison magán

$collection->insert($ojjektumVagyTomb); // itt beilleszthetünk egy tömböt vagy objektumot is akár, második paraméterként szintén opciókat adhatunk meg. Vigyázzunk, a beillesztendő objektumnak nem lehetnek privát/protected tagváltozói, valamint a string-ek csak UTF-8 formátumúak lehetnek, mert különben kivételt hajigál. Ha a beillesztendő dokumentumnak nincs _id fieldje/tagváltozója (ez egyfajta unique primary index), az automatikusan létrehozásra kerül és egy MongoId objektum fog belekerülni.
```

##### "SELECT \* FROM `users`<del> WHERE 1=1</del>"

Mivel mi már kijelöltük az adott kollekciót, ezért azt már nem kell megadnunk, csak a keresési feltételeket és a mezőket, amikre szükségünk van.

```
<pre data-language="php">$result = $collection->find(array(

    'access_token' => $token, // olyan dokumentumot keresünk, ahol a dokumentum->username = az általunk megadottal

    'scope' => $scope,

    'expires' => array ( // figyeljünk, mert itt már egy beágyazott tömb van

            '$lt' => $date, // ez itt egy  'expires' < $date. Vigyázzunk, hogy single quote-okat használjunk, mert különben a PHP megpróbálja értelmezni a $lt-t, mint változót, pedig az csupán annyit jelent esetünkben, hogy 'less than', azaz kisebb.

            ),

      ),

); // a fenti lekérés egyenértékű egy "SELECT * FROM `collectionNeve` WHERE 'access_token' = $token AND 'scope' = $scope AND 'expires' < $date"-el.
```

> MongoDate: Az adatbázisban lévő dátumokat a MongoDB nem stringként vagy számként tárolja, hanem úgynevezett MongoDate objektumokként, ami objektumok igazából szimpla value object-ek, és egymással az adatbázis össze tudja őket hasonlítani.

A metódusunk visszatérési értéke egy MongoCursor objektum, amit hasonlóképpen lehet kezelni, mint egy PDO resultsetet, tehát foreach-el tömbbé erőszakolhatjuk azt és minden egyes visszaadott elem egy dokumentum lesz az adatbázisból.

> Létezik findOne függvény is, ami mindenképp egy dokumentumot ad vissza

##### "UPDATE `bank\_account`<del> SET `money` = `sok`</del>"

Az update-re is van megfelelőnk, aminek a neve kinda obvious. Első paramétereként a keresési feltételeket várja, másodikként pedig egy új objektumot vár, vagy egy asszociatív tömböt a következő felépítésben:

```
<pre data-language="php">$setArray = array('$set' => array('propertyToSet' => 'value')); // itt is vigyázzunk a $set stringet körülvevő single quote-okra. 
$queryArray = array('identifier' => 3644554);
$objectToReplace = array('propertyToSet' => 'value');
```

```
<pre data-language="php">$collection->update($queryArray, $setArray); // ez az adott értéket beállítja 

$collection->update($queryArray, $objectToReplace); // ez viszont lecseréli a komplett objektumot és csak a fent megadott egy mező lesz benne (az _id-t leszámítva persze), ezért erre figyeljünk, mert könnyen cs***re futhatunk.
```

##### REMOVE

Ha törölni szeretnénk, akkor szintén adott collection-re specifikusan tudjuk megtenni azt:

```
$collection->remove(array( 'sql' => true)); // ahol az sql mező true-t tartalmaz, az mehet a süllyesztőbe!
```

Amint a fenti példákból láthattuk, nem egy nagy ördöngősség magunkévá tenni mindezt és ez a flexibilitás hatalmas szabadsággal ruház fel. Viszont mielőtt mindenki teljesen felhagyna az SQL megoldásokkal, mert az leszabályozza a mezőket, gondoljon bele abba is, hogy ez a flexbilitás + a PHP dinamikusan típusos mivolta eredményezhet nem várt hibákat, ha komplex objektumokat kezelünk az adatbázisban, úgyhogy azok ellenőrzését nekünk kell megtennünk, mert a MongoDb hű szolgaként kérdés nélkül megtesz nekünk bármit és a végén csak fogjuk a fejünket, ha már 100-200 objektumot toltunk az adatbázisba fail adatokkal.

Egyelőre ennyi legyen elég kisfröccsnek! Akinek ez nem elég vagy nem bírja kivárni a következő írásomat, annak ajánlom a [Révai Nagylexikont az M betűnél!](http://php.net/manual/en/book.mongo.php)