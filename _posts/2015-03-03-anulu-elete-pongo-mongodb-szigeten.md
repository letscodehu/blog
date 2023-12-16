---
id: 336
title: 'Anulu élete Pongo-MongoDB szigetén'
date: '2015-03-03T09:00:30+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=336'
permalink: /2015/03/03/anulu-elete-pongo-mongodb-szigeten/
dsq_thread_id:
    - '3562962704'
    - '3562962704'
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
    - data
    - db
    - document
    - flexibility
    - model
    - mongo
    - mongodb
    - nosql
---

Aki <del>látta már a Kincs, ami nincs című szuperprodukciót</del> találkozott már a MongoDB szócskával, demindeddig halvány gőze se volt arról, hogy ez pontosan mi is és mire való, azt leszámítva, hogy benne van a sokat sejtető DB szócska <del>(lsd: darab)</del>... na pont nekik szól ez a cikk! Megnézzük hogy is kell telepíteni, hogy kell használni PHP oldalon, miként tárolja az adatokat és még sok mást! Aki pedig nem érti és elakadna, az ne feledje: "Csak a puffin ad nekem erőt és mindent lebíró akaratot!"![127020_galeria_kincs_ami_nincs_02](assets/uploads/2015/02/127020_galeria_kincs_ami_nincs_02.jpg)

Mielőtt a lényegre térnénk, nézzük hol és mikor van jelentősége a MongoDB-nek, cikkünk fő témájának. A megoldások válaszok egy problémára, generáljunk hát egy problémát!

Tegyük fel, hogy oldalunk SQL alapú adatbázist használ és a sors oda vet minket, hogy az adatbázisban hierarchikus adatokat kellene tároljunk. Tároljunk mondjuk egy űrlapot, aminek különböző elemei lehetnek. Csináljunk például egy Form osztályt, aminek lesz például egy $fields példányváltozója, amiben az űrlaphoz tartozó mezők szerepelnek. Ezekhez a mezőkhöz hozzá lehet rendelni validátorokat, ami validátorok szintén objektumok, valamint az egész űrlap hozzá van rendelve egy userhez, ez is egy ojjektum és még van sok szép mezője.

Na most ezt egy relációs adatbázisban tárolni lehet, egyfajta nested set megoldással, amiről szintén fogok írni (ha lesz rá kereslet), de valljuk be, a relációs adatbázisokat nem erre találták ki. Adjacency modellel (parent\_id mezők és társai) tárolni mindezt pedig kész agyrém, mert 100 űrlap után kb. 5000 elemünk lenne az adatbázisban és minden egyes szintet/réteget külön kellene lekérdezni, vagy egy orbitális lekérdezést csinálni hozzá, ami nem a legoptimálisabb.

Az ilyen adatok tárolására nyújt nekünk segítséget a MongoDB. Ez az adatbázis a JSON-höz hasonló felépítésű dokumentumokat tárol. Egy-egy ilyen dokumentum egy vagy több mezőt tartalmazhat, ami mezők lehetnek tömbök, bináris adatok, netán "aldokumentumok". A mezők dokumentumonként változhatnak persze. Ez a flexibilitás lehetővé teszi, hogy dinamikusan változtassuk az adatmodelljeinket, ahogy új és új problémák/megoldások jönnek elő. Vegyük például azt az esetet, hogy egy új mezővel bővülne az űrlapunk. SQL-ben mindezt egy plusz mezővel tudnánk megoldani (hacsak nem az EAV model szerint építettük fel), ami üresen tátongana az addig létrehozott rekordokban és csak lassítaná a lekérdezéseket.

Nézzük meg, hogy néz ki egy ilyen dokumentum MongoDB-ben:

```
<pre data-language="javascript">{"_id" : "4332adf34f2d4f4432d4f4e",
  "content" : {
      "subcontent" : {
          "key" : "value",
      },
   },
}
```

Ez egy igen egyszerű dokumentum, amiben jól látható a JSON-hoz hasonló szerkezet. Ezek a dokumentumok úgynevezett collection-ökbe vannak rendezve, amiket hasonlóan kell elképzelni az SQL-es table-ökhöz, azzal a különbséggel, hogy ezek a collection-ök nem határozzák meg az alájuk tartozó dokumentumok sémáját, vagyis nincs rákényszerítve semmilyen field szerkezet, ahogy ezt pl. egy SQL táblában megszokhattuk. Ezek a collection-ök pedig adatbázisokhoz vannak rendelve, ugyanúgy, ahogy SQL-ben is.

A telepítéshez egy igen jó útmutatót találunk a [mongoDb](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/) honlapján, innen a linuxos verziót mesélném el, mivel jómagam linuxot használok, na meg a webszerverek többsége is, így jobb ezzel tisztában lenni.

> Figyelem, a nyugalom megzavarására alkalmas bash script-ek következnek!

[![](assets/uploads/2015/03/Televideo925Terminal-1024x849.jpg)](assets/uploads/2015/03/Televideo925Terminal.jpg)

Először is szükségünk lesz a public key-re, amivel ellenőrízni tudja a <del>K</del>ubuntu a letöltött csomagok valódiságát. Ezt a következő paranccsal tudjuk elérni:

```
<pre data-language="shell">sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
```

Ha ezzel megvagyunk, akkor elvileg a saját kis repository-nkba már importáltuk is Richard Kreuter barátunk publikus kulcsát. Utána tudatnunk kell a dpkg-vel, hogy a mongodb forrásfájlokat merre is találja:

```
<pre data-language="shell">echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
```

Miután a rendszer már felvette a saját kis listájára a mongo forrásfájlokat, nem ártana frissíteni a package-ek listáját se:

```
<pre data-language="shell">sudo apt-get update
```

Most, hogy felvettük a package-k listájára a mongodb-t, nem fog hülyét kapni a rendszer a következő parancs láttán, amivel a tényleges telepítést végezzük:

```
<pre data-language="shell">sudo apt-get install -y mongodb-org
```

Amíg ezt leszedjük, addig dőljünk hátra, mert ez jópár megát leszed/telepít.

Ha kész, akkor elviekben magától el is indítja a mongodb-t, de ha mégse tenné, akkor a következő paranccsal lehet életet lehellni a rendszerbe:

```
<pre data-language="shell">sudo service mongod start
```

#### Feltelepült, melyik testrészemhez nyúljak?

Például az egér, mint periféria pont megfelelő lenne. Ha feltelepült és a var/log/mongodb/ könyvtárunk se duzzadt két gigásra a hibaüzenetektől, akkor a <del>pongo</del>`mongo` paranccsal lehet előhívni a saját kis terminálját és barbárkodni, ahogy azt a mysql parancs után tennénk.

A szintaxis javascript-et idéző, úgyhogy senkinek ne legyen Deja vu érzése, nincs hiba a mátrixban:![DieHardOriginal500](assets/uploads/2015/03/DieHardOriginal500.jpg)

```
<pre data-language="shell">>db.trolo.save({"Bruce Willis":"Yipikaye"})
```

A fenti paranccsal létrehoztunk egy elemet a test adatbázison (ezt hozza létre telepítéskor) belül trolo collection-ben, aminek egy field-je van (az \_id mezőn felül, ami minden dokumentumhoz szükséges a kereséshez), Bruce Willis névvel és ennek értéke Yipikaye.

Erre a terminál a következőképp fog reagálni:

```
WriteResult({nInserted: 1})
```

Na most messziről jött ember azt mondd, amit Laci, ezért nem hisszük csak úgy a terminalnak, hogy tényleg beszúrt egy elemet kérdezzük hát le a trolo collection elemeit:

```
<pre data-language="shell">>db.trolo.find()
```

Oké, úgy néz ki a mongodb maradhat, mert képes volt a CRUD első tagját végrehajtani, upvote!

Aki nem szereti ezt a felületet, és egy a phpmyadmin-hez hasonló elérést szeretne, akkor megnyugodhat, egy igen jó cross-platform program áll rendelkezésre UI-val, amit [itt](http://robomongo.org/download.html) tölthet le.

Ez mind szép és jó, de mégis hogy fogjuk ezt elérni PHP-ből vagy bárhonnan? Nos a PHP oldalát még elmesélem, mert nem egy nagy ördöngősség. Ha felcsapjuk a révai nagylexikont a [P](http://php.net/) betűnél, akkor láthatjuk, hogy elég szép kis [dokumentációt](http://php.net/manual/en/book.mongo.php) sikerült összedobni a srácoknak.

A PHP-vel való összeboronálására most nem térnék ki, mert fejlesztői környezete vállógatja, de akinek nem sikerülne, az jelezze és sort kerítek arra is!

Ha erre nem lesz precedens, akkor a következő részben végignézzük a különféle parancsokat, valamint azok visszatérési értékét és ezek kapcsán megismerkedünk majd az iterátorokkal is!