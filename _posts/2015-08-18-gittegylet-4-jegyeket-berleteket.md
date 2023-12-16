---
id: 517
title: 'Gittegylet 4 &#8211; Jegyeket, bérleteket'
date: '2015-08-18T18:27:29+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=517'
permalink: /2015/08/18/gittegylet-4-jegyeket-berleteket/
dsq_thread_id:
    - '4044573274'
    - '4044573274'
categories:
    - Egyéb
tags:
    - client
    - commit-msg
    - git
    - hook
    - pre-commit
    - prepare-commit-msg
    - side
---

A verziókövetésnek bármelyikről is beszéljünk, van egy bizonyos workflow-ja, amit ha nem is teljesen, de egyes részeit bizonyára megismertük már a használat közben. A Git, más rendszerekhez hasonlóan biztosít lehetőséget arra, hogy <span style="text-decoration: line-through;">leszálljunk a buszról, mielőtt a közteresek megjönnek</span> ha belenyúlni nem is, plugin módjára hozzácsapjunk ezt azt a workflow bizonyos pontjaihoz. Aki vette a bátorságot és foglalkozott népszerű CMS-ekkel, annak a hook fogalma nem lesz ismeretlen.

A lényege annyi, hogy egy adott actionhöz hozzáakasztunk egy általunk készített actiont.  
Mielőtt egyesek infarktus közeli állapotba kerülnének, nem, nem a git kódjában fogunk túrkálni, habár némi bash script tudás nem árt majd. Ha beletúrtunk igényesen a .git mappába, akkor bizonyára találkoztunk már a hooks könyvtárral, esetleg a tartalmával is. Nos ennek semmi köze a <span style="text-decoration: line-through;">kalauzokhoz</span> kalózokhoz, viszont a témánkhoz annál inkább:![Captain_Hook_(Hook)](assets/uploads/2015/05/Captain_Hook_Hook-1024x673.jpg)

#### Mi kell ahhoz, hogy mindezt életre leheljük?

Nos, első körben kitartás az, hogy a script neve pontosan megegyezzen azzal, amit a kedves Git-ünk keresni fog. A másik pedig az, hogy futtatható legyen az adott felhasználó által. Ez a felhasználó lehet az, akivel beSSH-zunk, vagy a webszerver usere, ha HTTPS-en keresztül csináljuk, vagy éppen mi, ha lokálban piszkáljuk. Nem történik itt semmi más csoda, csupán annyi, hogy amikor a git az adott workflow-hoz ér, megnézi a hooks könyvtárat és keresi az action-höz tartozó hook-ot. Ha megtalálja, akkor megpróbálja elindítani és ha elindult, akkor a process visszatérési értéke ([Exit code](https://en.wikipedia.org/wiki/Exit_status#POSIX)) alapján csinál/nem csinál valamit.

> A script lehet bash script, perl, python, php, stb. Amíg a bemeneti paraméterek és az exit code stimmel.

A hook-okat feloszthatjuk két csoportra, kliens és szerveroldaliakra. Most nézzük először a kliensoldaliakat:

##### Commit specifikus hook-ok:

Ezek a script-ek a commit folyamat bizonyos pontjain hívódnak meg. Név szerint:

```
pre-commit, prepare-commit-msg, commit-msg
```

##### Pre-commit

Ez a script fog először lefutni amikor commitolunk, még a commit message képernyő előtt. A kódot szokták ezen a ponton ellenőrízni, hogy bizonyos minőségügyi követelményeknek megfelel-e, mielőtt beengednék a verziókövetésbe. Az ilyen ellenőrzések közé tartozik a [lint ](https://en.wikipedia.org/wiki/Lint_(software))( php -l ), a [tesztek ]({{ site.url }}/2015/01/06/unit-test-meg-amit-akartok/)lefuttatása, [PHP mess detector](http://phpmd.org/), [Check style](https://github.com/PHPCheckstyle/phpcheckstyle) és hasonlók.

Na de nézzük meg hogy is lehet ebbe a fájlba beleoktrojálni valami finomságot (és nem, most nem evil perl script lesz az, ami életünk hátralevő részében kísérteni fog, hanem plain PHP)!

```
<pre data-language="php">#!/usr/bin/env php // php lesz az interpreterünk
<?php 

$allFiles = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(__DIR__."/../../")); // itt egy recursive iteratoron át lekérjük a könyvtárban található összes fájlt
$phpFiles = new RegexIterator($allFiles, '/\.php$/'); // majd leszűkítjük a kört a .php végződésűekre.

foreach ($phpFiles as $file) { // ha már iterátor, akkor végigiterálunk rajta
 $retval = 0; 
 $escapedFile = escapeshellarg($file); // escapeljük a shell argumentumnak valót
 echo exec('php -l ' . $escapedFile, $output, $retval)."\n"; // majd futtatunk a fájlon egy syntax analízist a php interpreterünkel és kiíratjuk az output-ot
 if ($retval !== 0) { // ha a visszatérési érték nullától eltérő,
    exit(1); akkor bizony mi se nullával fogunk visszatérni és ezzel a commit-nak elejét is vettük
 } 
} 
exit(0);
?>
```

A fenti script segíthet nekünk abban, hogy végignyálazzuk a fájljainkat, syntax errorokra vadászva. Nem egy atomfizika, ugye? Ezeket persze ki lehet szervezni fájlokba és akkor sokkal egyszerűbben lehet rendszerezni az egészet.

##### Prepare-commit-msg

Ez a script akkor fut le, mikor az iménti pre-commit végzett és még nem készült el a commit message, viszont egy default message már készen áll. Ennek a default message-nek a szerkesztésére és módosítására szolgál ez a hook. Itt már paraméterként kapunk ezt-azt, mégpedig: a fájl nevét, amiben a commit message található amit megadtunk az -m paraméterrel, a commit típusát, valamint a SHA-1 azonosítóját a commitnak, ha amend commitról van szó. Nézzük csak meg, mit tudunk ezzel kezdeni!

```
<pre data-language="php">#!/usr/bin/env php
<?php 

$name = "user.name="; // a config kiíratásakor ebben a sorban lesz a név
$email = "user.email="; // ebben pedig az e-mail cím


if (array_key_exists(1,$argv)) { // megnézzük, hogy van-e commit message fájl, 
 $commit_msg = file_get_contents($argv[1]); // beolvassuk a meglévő commit message-et
 exec('git config -l', $output); // kiíratjuk a config beállításokat
 foreach ($output as $row) { // végigiterálunk a git config outputjának sorain
   if (strpos($row, $name) !== false) { // ha megtaláljuk a nevet
     $commit_msg .= " by ". substr($row, strlen($name)); // hozzácsapjuk az üzenethez
   } elseif (strpos($row, $email) !== false) { // ha az e-mailt is,
     $commit_msg .= "<".substr($row, strlen($email)). ">";  // akkor azt is
   }
 }
 file_put_contents($argv[1], $commit_msg); // végül felülcsapjuk a régi commmit message-et tartalmazó fájllal
 
}

exit(0); // és visszatérünk 0-val.
```

A fenti hook sem túl bonyolult, csupán annyit csinál, hogy a már meglévő commit message után fűzi a gitben megadott username-t és emailt. Így az "Initial commit"-ból

"Intial commit by Felhasználónév<email@cim>" lesz. Sajnos túl sok más use-case-t nem találtam erre a hookra, úgyhogy sunyi módon tovább is lépnék 🙂

##### Commit-msg

Ez a hook a commit message validálására szolgál. Ha 0-tól különböző kóddal tér vissza, akkor a commit folyamat megszakad.

```
<pre data-language="php">#!/usr/bin/env php
<?php
if (array_key_exists(1,$argv)) {
 $commit_msg = file_get_contents($argv[1]); // kinyerjük a commit message-et
 
 if (strlen($commit_msg) < 5) { // ha az üzenet hossza kisebb, mint 5 karakter,
   echo "Commit message must be at least 5 characters!\n"; // kiírjuk a hibaüzenetet
   exit(1); // akkor visszatérünk 1-el, így megszakad a commit
 }
 exit(0); // ellenkező esetben továbbengedjük azt
}
exit(1); // ha nincs commit message fájl, akkor is visszadobjuk a commit-ot.

```

> **Fontos!** Amikor a repóból lerántjuk a dolgokat, pl. clone-al, akkor a kliensoldali hook-ok NEM jönnek vele együtt,

Egyelőre a hookokról ennyit, kapkodtam kicsit, de már régóta ígértem (valakinek :P).

A legközelebbi cikkemben szó lesz egyéb kliensoldal hook-okról, valamint arról is, mivel lehet a szerveroldalon megpiszkálni a dolgokat!