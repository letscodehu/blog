---
id: 2108
title: 'Klasszikus ::class'
date: '2020-02-12T11:02:45+01:00'
author: adam.turcsan
layout: post
guid: '/?p=2108'
permalink: /2020/02/12/klasszikus-class/
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2020/02/12123007/wood-houses-school-old-9285.jpg'
categories:
    - Backend
    - PHP
    - Újdonságok
tags:
    - news
    - oop
    - php
    - php8
---

Az a csodálatos feladat hárult rám, hogy értesítsem az itt egybegyűlteket a PHP-s hírekről, újdonságokról, és egyéb finomságokról. És valljuk be, ez számomra nem esik túl távol.

Mivel ez az első ilyen jellegű – és amúgy globálisan is első – bejegyzésem, ezért engedjetek meg egy átfogó bemutatást, majd csapjunk is bele a lecsóba.

Kétféle feladatot érzek feladatomnak téma keretein belül. Egyrészt, hogy a lehető legfrissebben tartsam a Kedves Olvasók ismereteit a PHP újdonságait illetőleg, másrészt, egyfajta evangelizáció jelleggel, a nem túl új, de mégis a nyelv történetéből fakadóan esetleg szokatlan, vagy jelentős újításokat is megfelelően bemutassam.

Mivel éppen egy főverzió előkészületei folynak a PHP háza táján, ezért egész ütemesen érkeznek a kisebb-nagyobb újdonságok, így először ezekkel kezdeném bemelegítés gyanánt.

## ::class

A PHP5.5 óta használható a ::class nevű konstans. A használata a következő:``

```
echo NAMESPACE\CLASS::class;
```

Ami szimplán kiírja az osztály "fully qualified", azaz a gyökér névtértől kezdve felbontott, teljesen egyedi nevét.

Előnye, hogy mivel egy osztály konstans akkor is tökéletesen használható, ha "beuse-olt", vagy névtéren belüli osztályoknál alkalmazzuk:

```
<?php

namespace App;

use App\Repository\User as UserRepository;

echo User::class . PHP_EOL; // kiírja az "App\User" stringet
echo UserRepository::class . PHP_EOL; // kiírja az "App\Repository\User" stringet
```

[3v4l.org](https://3v4l.org/S0iSe)

A szintaktika teljesen megegyezik az osztály konstansok elérésével, így sokakban felmerült az igény, hogy a többi konstanshoz hasonlóan az osztály példányain keresztül, az objektumokon keresztül is elérhető legyen.

```
<?php

class Foo {

    public const Bar = 'baz';

}

$object = new Foo();

echo Foo::Bar . ' - ' . $object::Bar . PHP_EOL; // Kiírja: "baz - baz"
```

[3v4l.org](_wp_link_placeholder)

Viszont, ha a következő sort hozzátesszük a kódhoz:

```
echo $object::class;
```

Akkor már a következő hibaüzenetet kapjuk:

```
Fatal error: Cannot use ::class with dynamic class name
```

Ebből két dolog következik:

- Ha eddig nem tudtuk volna: a konstansokat compile time kezeli a PHP is – mint a nyelvek többsége –, így az egész szkriptünk hibára fut, mielőtt megkezdődne a futás (Ez egyébként nem 100%-ban igaz, erről majd beszélünk később)
- Az objektumokon keresztül nem érhető el ez a – nevezzük így – "pszeudo konstans"

### $object::class

Egy minap elfogadott [RFC](https://wiki.php.net/rfc/class_name_literal_on_object) alapján a PHP 8.0-ban ez a fenti hibaüzenet eltűnik, és használhatóvá válik ez a rövid megoldás.

Gyakorlatilag felcserélhető lesz a

```
get_class($object);
```

hívással.

A funkcionalitás bővítése mögötti indokok:

- egyrészt, ahogy azt zárójelesen megjegyeztem, már eleve voltak esetek, amikor nem compile time kellett feloldani a konstansokra való hivatkozást, így megvolt a helye az implementációnak
- másrészt szintaktikailag egységesebb, konzisztensebb képet mutat ennek a funkciónak a megjelenése.

A kezdeményezés egyhangú igen szavazással kerül be a következő verzióba.