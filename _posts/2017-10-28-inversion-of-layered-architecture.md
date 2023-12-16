---
id: 1616
title: 'Inversion of layered architecture'
date: '2017-10-28T20:08:55+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/admin/?p=1616'
permalink: /2017/10/28/inversion-of-layered-architecture/
tie_post_bg:
    - ''
tie_post_color:
    - ''
tie_gallery_style:
    - slider
tie_link_url:
    - ''
tie_link_desc:
    - ''
tie_video_url:
    - ''
tie_embed_code:
    - ''
tie_audio_mp3:
    - ''
tie_audio_m4a:
    - ''
tie_audio_oga:
    - ''
tie_audio_soundcloud:
    - ''
tie_quote_author:
    - ''
tie_quote_link:
    - ''
tie_quote_text:
    - ''
tie_status_facebook:
    - ''
tie_status_twitter:
    - ''
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2017/10/09213239/asphalt-balance-blur-close-up-268018.jpg'
categories:
    - Advanced
    - Architecture
    - PHP
tags:
    - architecture
    - inversion
    - layered
    - php
---

Hosszú ideje nem volt már technikai jellegű bejegyzés a blogon, épp itt az ideje kicsit változtatni ezen. A cikket az egyik stackoverflow kérdésre adott válaszom ihlette, ahol megkaptam, hogy a kedvenc UML-emről igazán írhatnék valami cikket, ezt pedig megfogadom 🙂 A legtöbben ismerjük az úgynevezett layered architektúrát, aminek a lényege az, hogy alkalmazásunkat több különböző rétegre bontjuk. Ezek a rétegek egymásra épülnek és a felhasználó, legyen az egy tényleges felhasználó vagy valami egyéb kliens, mindig a tetejével lép kapcsolatba. Na most a dependency inversion elve nem csak osztályokra értelmezhető, hanem ilyen modulokra is. Na de mégis hogyan?[![](assets/uploads/2017/10/sapr_0101-300x224.png)](assets/uploads/2017/10/sapr_0101.png)

A nyelv, amit most használni fogunk PHP lesz és az egyes rétegeket nem az alkalmazásba fogjuk beleágyazni, hanem külön composer csomagokként valósítjuk meg, ahogy azt sok esetben egyébként sem ártana, már ha nem valami másfajta modulokkal dolgozunk 🙂 Első körben megnézzük az alapfelállást, ahogy általában ez ki szokott nézni. Ugyebár a rétegek egymással szoros kapcsolatban szoktak állni és a magasabb szintű rétegek az alacsonyabb szintűektől függnek. Mégpedig az implementációtól. Na itt kezdődik a probléma, ugyanis ebben a formában az egyes csomagokat nem lehet csak úgy cserélgetni. Az alkalmazásunk függeni fog az összestől és újabb implementációt be tudunk húzni, de attól még a régire is hivatkozni fogunk. Na de nézzük, hogy nézne ki a fenti megoldás egyes elemeinek composer.json-je és lássuk meg a problémát benne. Kezdjük a tetejével, ami a presentation layer lesz:

```
{
  "name" : "letscodehu/dummy-presentation-layer",
  "version" : "1.0.0",
  "require" : {
    "letscodehu/dummyservice-layer" : "^1.0.0"
  },
  "repositories" : [
    {
      "type" : "vcs",
      "url" : "https://github.com/letscodehu/dummy-service-layer"
    }
  ],
  "autoload" : {
    "psr-4" : {
      "Letscodehu\\" : "src/"
    }
  }
}
```

Itt jól látható, hogy egy konkrét service implementációra hivatkozunk. Ezzel még annyira nincs is baj, hiszen mekkora az esély, hogy egyszer csak kirántanánk alóla a leplet, nem igaz? Viszont a dependency inversion elve, erre a hibára már osztályszinten felhívja a figyelmet. Na de menjünk tovább, a business layer felé:

```
{
  "name" : "letscodehu/dummy-service-layer",
  "version" : "1.0.0",
  "require" : {
    "letscodehu/dummy-persistence-layer" : "^1.0.0"
  },
  "repositories" : [
    {
      "type" : "vcs",
      "url" : "https://github.com/letscodehu/dummy-persistence-layer"
    }
  ],
  "autoload" : {
    "psr-4" : {
      "Letscodehu\\" : "src/"
    }
  }
}
```

Újabb réteget raktunk rá az alkalmazásunkra. Ez az úgynevezett tranzitív függőség, mikor egy csomagra szükségünk van, de annak szüksége van további csomagokra is. A függőségek minden esetben problémát jelentenek, legyen szó osztályokról vagy épp csomagokról. Van ahol apróbb, van ahol nagyobb problémát. Minél több mindentől függ az adott csomag, annál instabilabb lesz. Ha tegyük fel, a library-nak amit fejlesztünk van két függősége, akkor ha azokban valami breaking change történik, akkor azok kihatással lesznek a mi alkalmazásunkra. Ha azoknak is vannak függőségeik, akkor az azokban levő breaking changek is kihatnak ránk és így tovább folytatódik a láncolat. Na de akkor jöjjön az utolsó réteg:

```
{
  "name" : "letscodehu/dummy-persistence-layer",
  "version" : "1.0.0",
  "autoload" : {
    "psr-4" : {
      "Letscodehu\\" : "src/"
    }
  }
}
```

Ez már jobban néz ki, nem? Persze, mert ez a lánc vége, a persistence layerünknek nincsen semmiféle csomagra szüksége. Ez lenne az ideális, nemde? Nos nem feltétlenül. Amit eddig csináltunk, az az alábbi képen látható:

[![](assets/uploads/2017/10/flowRoot6177-300x75.png)](assets/uploads/2017/10/flowRoot6177.png)

Az egyes rétegek szépen hivatkoznak egymás konkrét implementációs csomagjaira. Amíg mindezt egy csapat fejleszti, és nem szándékozunk kicserélni az egyes rétegeket, addig még nagy probléma nem történhet. Viszont ha le akarjuk váltani a persistence réteget, akkor biza nincs egyszerű dolgunk, még akkor se, ha azt valaki más már megírta helyettünk. Ugyebár a persistence rétegben levő osztályokat és interfészeket használjuk a business rétegben. Ennélfogva, ha az alkalmazásunk skálázása érdekében az eddigi lokális adatelérési réteget le akarjuk cserélni, hogy valami microservice hívásokban megvalósítsuk azt, biza nem lesz olyan plug-n-play hatása. Ugyanis ennek a REST implementációnak vagy definiálnia kell azokat a DTO-kat, amik a két réteg között közlekednek és az interfészeket, osztályokat.. ami ugyebár kódduplikáció a két csomag közt.. vagy bináris dependencia lesz a régi SQL implementáció és a REST implementáció között, ami megint nem az igazi, mert egy ilyen composer.json-t eredményezne:

```
{
  "name" : "letscodehu/rest-persistence-layer",
  "version" : "1.0.0",
  "require" : {
    "letscodehu/dummy-persistence-layer" : "^1.0.0"
  },
  "repositories" : [
    {
      "type" : "vcs",
      "url" : "https://github.com/letscodehu/dummy-persistence-layer"
    }
  ],
  "autoload" : {
    "psr-4" : {
      "Letscodehu\\" : "src/"
    }
  }
}
```

Hát ez nem túl szép, nemde? Minek kellene a REST megvalósításnak az SQL megvalósítás? Na pont az ilyen esetekre találták ki az úgynevezett interfész csomagokat. Ezek a csomagok csak az adott interfészre vonatkozó interfészeket és az objektumok között közlekedő data transfer objecteket tartalmazzák. A legfontosabb jellemzőjük, hogy mivel egy interfészt írnak le és nem az implementációt, ezért sokkal stabilabbak, mint azok a csomagok, amikben keményen folyik a fejlesztés. Ilyen csomagokon dependálni nem lesz annyira fájdalmas, mégpedig azért, mert az interfész csomagok nem (sűrűn) változnak, ellentétben az implementációs csomagokkal. Na de mit jelent ez, hogy fáj? Azt, hogy valami a kódban megváltozik, ami miatt nekünk módosítani kell a mi kódunkat, hogy lekövessük azt a változást. Például megváltozik egy metódus neve, új kivételt dob, amire nincs catch águnk és hasonlók. Tegyük fel, hogy a csomag, amire dependálunk, tartalmazza az alábbi metódust:

```
class BillingClient {
    public function revokeBill($id) {
        // valami implementáció
    }
}
```

A mi kódunkban pedig természetesen ezt használjuk. Na ha ezt a revokeBill-t kiegészítik egy új kötelező paraméterrel és mi behúzzuk azt a frissítést hozzá (mert rossz megkötést adtunk meg composerben vagy a csomag fejlesztője nem követi a szemantikus verziózást - mindkettőre láttunk már példát 😀 ), akkor biza nálunk csúnya hibák fognak megjelenni és minden olyan helyen, ahol azt használtuk, frissítenünk kell a kódunkat. Ilyen az, amikor az általunk használt csomag, eltöri a mi kódunkat. De miért jobbak az interfész csomagok ebből a szempontból? Nos elsősorban azért, mert az ilyen interfészeket (jó esetben) a tervezés során határozzák meg és később (szintén jó esetben), csak főverzió emelésekor változnak. Persze mondhatnánk, hogy hát ezeket az interfészeket használjuk az implementációs csomagban, ha az interfészben megváltozik, akkor ez utóbbiban is megfog, nem? Ez igaz, viszont nem csak a mi kódunk és a közvetlenül behúzott csomag közötti interfész törhet el. Az implementációs csomagokban több kód van, más csomagokat is használnak, amik szintén veszélyt jelenthetnek. Tehát tegyük fel, ha mi behúzzuk A-t, az behúzza a B-t és C-t, amik behúzza a D,E,F csomagokat, akkor már hat olyan csomag van, amik között galiba lehet.

Na de az előző példára visszatérve, mégis mit jelent ez nekünk? Nos ilyen interfész csomagokkal megvalósítható az alábbi UML:

[  
![](assets/uploads/2017/10/fr6YE-300x105.png)](assets/uploads/2017/10/fr6YE.png)

A fenti képen egy rétegelt alkalmazás leegyszerűsített osztálydiagramja látható, ahol az eddig említett három réteg közé másik kettő került be, így a három csomagunkból csináltuk ötöt. Na most miért segítene ez rajtunk? Hát nem arról volt szó az imént, hogy a kevesebb függőség a tuti? De bizony, viszont nem mindegy, hogy az egyes csomagok hogy is hivatkoznak egymásra. Nézzük meg, hogy is kell átalakítani a fentieket! Kezdjük a composer.json-ökkel! A perssitence layer implementációja mostantól a közte és a service layer közötti interfész csomagra fog dependálni:

```
{
  "name" : "letscodehu/dummy-persistence-layer",
  "version" : "1.0.0",
  "require" : {
      "letscodehu/persistence-layer-api" : "^1.0.0"
  },
  "autoload" : {
    "psr-4" : {
      "Letscodehu\\" : "src/"
    }
  }
}
```

Így azok az interfészek és DTO-k, amik eddig ebben voltak definiálva, átkerülnek egy interfész csomagba. Ami itt marad, az pár dummy implementáció lesz, mint a UserEntity:

```
<?php

namespace Letscodehu;

/**
 * Represents a user in the database.
 */
class UserEntity
{

}
```

Valamint a UserTransformer, ami az entity-t átalakítja a két réteg között közlekedő DTO-ra:

```
<?php

namespace Letscodehu;

class UserTransformer
{

    /**
     * Transforms a UserEntity to a User.
     * @param UserEntity $userEntity
     * @return User $user
     */
    public function transform(UserEntity $userEntity) {
        return new User();
    }

}
```

Ezen kívül értelemszerűen a DAO lesz még itt, ami arra az interfészre dependál, ami az interfészben van definiálva. Ez az objektum fogja használni azt a transformert, ami aztán az interfészben is meghatározott DTO-t fogja kiköpni magából:

```
<?php

namespace Letscodehu;

class SqlUserDao implements UserDao
{

    /**
     * @var UserTransformer
     */
    private $transformer;

    /**
     * SqlUserDao constructor.
     * @param $transformer
     */
    public function __construct(UserTransformer $transformer)
    {
        $this->transformer = $transformer;
    }

    public function findOne($id) {
        return $this->transformer->transform(new UserEntity());
    }

}
```

Akkor jöjjön az a csomag, amire a fenti dependált:

```
{
  "name" : "letscodehu/persistence-layer-api",
  "version" : "1.0.0",
  "autoload" : {
    "psr-4" : {
      "Letscodehu\\" : "src/"
    }
  }
}
```

Láthatjuk, hogy most ennek a csomagnak nincs függősége, lévén, mert ez egy interfész csomag, és nagyban befolyásolná a stabilitását, ha ennek is lenne függősége. A csomagban csak egy UserDao interfész:

```
<?php

namespace Letscodehu;


interface UserDao
{
    /**
     * Finds a User by it's ID.
     * @param $id
     * @return User
     */
    public function findOne($id);
}
```

és egy DTO lesz:

```
<?php

namespace Letscodehu;

class User
{

}
```

A példa természetesen nem valós, viszont már épp elég komplex, hogy látszódjon majd a mondandóm. Akkor jöjjön a következő interfész csomag, ami a service és a presentation közötti kapcsolatért felelős:

```
{
  "name" : "letscodehu/service-layer-api",
  "version" : "1.0.1",
  "autoload" : {
    "psr-4" : {
      "Letscodehu\\" : "src/"
    }
  }
}
```

Szintén nincs függősége, így ez is stabil lesz. Ez a csomag is csak két apróságot fog tartalmazni az egyszerűség kedvéért, szintén egy interfészt, amit a service fog használni:

```
<?php

namespace Letscodehu;

interface UserService
{

    /**
     * @param $id
     * @return UserProfileView
     */
    public function showProfile($id);

}
```

valamint egy DTO-t, amit mind a service, mind pedig a presentation layer:

```
<?php

namespace Letscodehu;


class UserProfileView
{

}
```

Ezután jöjjön a service layer, ami már két interfészre is dependálni fog, ugyanis ő van a szendvics közepén:

```
{
  "name" : "letscodehu/dummy-persistence-layer",
  "version" : "1.0.0",
  "require" : {
    "letscodehu/persistence-layer-api" : "^1.0.0",
    "letscodehu/service-layer-api" : "^1.0.0"
  },
  "repositories" : [
    {
      "type" : "vcs",
      "url" : "https://github.com/letscodehu/persistence-layer-api"
    },
    {
      "type" : "vcs",
      "url" : "https://github.com/letscodehu/service-layer-api"
    }
  ],
  "autoload" : {
    "psr-4" : {
      "Letscodehu\\" : "src/"
    }
  }
}
```

Itt két konkrét osztályunk lesz, az egyik a transformer, ami a service által lekért User-ből, ami a persistence layer api-ban van definiálva, profileview-t csináljon, ami a service-api-ban van definiálva:

```
<?php

namespace Letscodehu;


class ProfileViewTransformer
{

    /**
     * Transforms a user to UserProfileView.
     * @param User $user
     * @return UserProfileView
     */
    public function transform(User $user) {
        return new UserProfileView();
    }

}
```

A másik pedig a konkrét service, aminek az interfésze szintén a serivce-api csomag része:

```
<?php

namespace Letscodehu;

class LocalUserService implements UserService
{

    private $transformer;
    private $userDao;

    /**
     * LocalUserService constructor.
     * @param ProfileViewTransformer $transformer
     * @param UserDao $userDao
     */
    public function __construct(ProfileViewTransformer $transformer, UserDao $userDao)
    {
        $this->transformer = $transformer;
        $this->userDao = $userDao;
    }

    /**
     * @param $id
     * @return UserProfileView
     */
    public function showProfile($id)
    {
        return $this->transformer->transform($this->userDao->findOne($id));
    }
}
```

Az utolsó csomag, az pedig a presentation layer lesz:

```
{
  "name" : "letscodehu/dummy-presentation-layer",
  "version" : "1.0.0",
  "require" : {
    "letscodehu/service-layer-api" : "^1.0.0"
  },
  "repositories" : [
    {
      "type" : "vcs",
      "url" : "https://github.com/letscodehu/service-layer-api"
    }
  ],
  "autoload" : {
    "psr-4" : {
      "Letscodehu\\" : "src/"
    }
  }
}
```

Ez a réteg ugye a service-layer-api-tól függ, mivel a service interfésze és az az által visszaadott DTO abban van definiálva. Egy osztályt raktunk ebbe bele, ami egy ún. view facade lesz, ami értelemszerűen több feladatot látna el a mostaninál:

```
<?php

namespace Letscodehu;


class UserViewFacade
{
    private $userService;

    /**
     * UserViewFacade constructor.
     * @param $userService
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * @param $id
     * @return UserProfileView
     */
    public function showProfile($id) {
        return $this->userService->showProfile($id);
    }

}
```

Most, hogy megvannak az elemek, dobjuk őket össze valami egyszerű kis dummy applikációba! A szükséges composer.json:

```
{
  "name" : "letscodehu/dummy-application",
  "version" : "1.0.0",
  "require" : {
    "letscodehu/dummy-service-layer" : "^1.0.0",
    "letscodehu/dummy-persistence-layer" : "^1.0.0",
    "letscodehu/dummy-presentation-layer" : "^1.0.0"
  },
  "repositories" : [
    {
      "type" : "vcs",
      "url" : "https://github.com/letscodehu/dummy-service-layer"
    },
    {
      "type" : "vcs",
      "url" : "https://github.com/letscodehu/dummy-persistence-layer"
    },
    {
      "type" : "vcs",
      "url" : "https://github.com/letscodehu/dummy-presentation-layer"
    },
    {
      "type" : "vcs",
      "url" : "https://github.com/letscodehu/persistence-layer-api"
    },
    {
      "type" : "vcs",
      "url" : "https://github.com/letscodehu/service-layer-api"
    }
  ],
  "autoload" : {
    "psr-4" : {
      "Letscodehu\\" : "app/"
    }
  }
}
```

Itt látható, hogy közvetlenül csak három függőségünk van, viszont mivel csak githubon találhatóak meg a csomagok, ezért a tranzitív függőségek repository-jait is fel kell venni. Csak a konkrét implementációkra van szükségünk, ugyanis azok majd behúzzák a köztük levő interfész layert. Ha ügyesen van megoldva az implementációs rétegek verzió megkötése, akkor nem tudunk inkompatibilis csomagokat összeválogatni, ugyanis a composer nem engedné hogy két különböző verziót behúzzunk egyazon interfész csomagból. Az appunkat az app mappába fogjunk elhelyezni és a központi része pedig az Application osztályunk lesz:

```
<?php

namespace Letscodehu;


class Application
{
    private static $instance;
    private $container;

    private function __construct(callable $config)
    {
        $this->container = new ServiceContainer($config);
    }

    public static function init(callable $config) {
        if (self::$instance == null) {
            self::$instance = new self($config);
        }
        return self::$instance;
    }

    public function start() {
        // some routing logic
        $controller = $this->container->get(ProfileController::class);
        var_dump($controller->showProfile(1));
    }

}
```

Az init statikus függvény lazy loadolja az applikációnkat, ami most egy singleton lesz, az egyszerűség kedvéért. A konstruktorában példányosít egy betonegyszerű service containert, aminek átadja a kapott callable-t. A start-ban pedig kikéri a konténerből a profilecontrollert és kidumpolja az egyik metódushívás eredményét. Ezt fogjuk majd az index.php-ből beröffenteni:

```
<?php

require_once "vendor/autoload.php";

\Letscodehu\Application::init(include "config.php")->start();
```

Behúzzuk a composer autoloaderét és az init statikus metódussal lazy loadoljuk az appunkat és átadjuk neki a a config.php-ben található konfigurációt. Az említett ProfileController szintén elég egyszerű, a viewfacade felé delegálja a hívást:

```
<?php

namespace Letscodehu;


class ProfileController
{

    private $viewFacade;

    /**
     * ProfileController constructor.
     * @param UserViewFacade $viewFacade
     */
    public function __construct(UserViewFacade $viewFacade)
    {
        $this->viewFacade = $viewFacade;
    }

    public function showProfile($id) {
        return $this->viewFacade->showProfile($id);
    }


}
```

Na de ami itt érdekes lehet, az a service containerünk:

```
<?php

namespace Letscodehu;


class ServiceContainer {

    private $container = [];

    public function __construct(callable $config) {
        $config($this);
    }

    public function get($serviceName) {
        if (array_key_exists($serviceName, $this->container)) {
            $service = $this->container[$serviceName];
            if (is_callable($service)) {
                $this->container[$serviceName] = $service($this);
            }
            return $this->container[$serviceName];
        } else throw new \InvalidArgumentException("Error getting '$serviceName', no such service bound!");
    }

    public function put($serviceName, $instance) {
        if (!is_object($instance)) {
            throw new \InvalidArgumentException("You must provide an instance!");
        }
        $this->container[$serviceName] = $instance;
    }

    public function bind($serviceName, $serviceDefinition) {
        if (!is_callable($serviceDefinition)) {
            throw new \InvalidArgumentException("You must provide a callable!");
        }
        $this->container[$serviceName] = $serviceDefinition;
    }

}
```

Ez lényegében a konstruktorban megkapott anonym functionnek átadja önmagát. Ebből kifolyólag abban található majd a konfigurációja, amit kódból végzünk el. A konténer elég egyszerű, a put-al konkrét példányt, a bind-al pedig callable-t lehet neki átadni. Mikor meghívjuk egy service-en a get-et, akkor a benne található service-t kiszolgálja, már ha létezik. Ha egy callable-t talál, akkor előtte lefuttatja azt és letárolja annak eredményét. Ezzel tudjuk megoldani a lazy loadját a serviceeinknek.

A config.php tartalma lényegében a service containerünk konfigurációja lesz majd:

```
<?php

use Letscodehu\LocalUserService;
use Letscodehu\ProfileController;
use Letscodehu\ProfileViewTransformer;
use Letscodehu\ServiceContainer as Container;
use Letscodehu\SqlUserDao;
use Letscodehu\UserDao;
use Letscodehu\UserService;
use Letscodehu\UserTransformer;
use Letscodehu\UserViewFacade;

return function(Container $container) {
    $container->bind(ProfileController::class, function(Container $container) {
        $viewFacade = $container->get(UserViewFacade::class);
        return new ProfileController($viewFacade);
    });

    $container->bind(UserViewFacade::class, function(Container $container) {
        $service = $container->get(UserService::class);
        return new UserViewFacade($service);
    });

    $container->put(ProfileViewTransformer::class, new ProfileViewTransformer());
    $container->bind(UserService::class, function(Container $container) {
        $transformer = $container->get(ProfileViewTransformer::class);
        $dao = $container->get(UserDao::class);
        return new LocalUserService($transformer, $dao);
    });
    $container->put(UserTransformer::class, new UserTransformer());
    $container->bind(UserDao::class, function(Container $container) {
        $transformer = $container->get(UserTransformer::class);
        return new SqlUserDao($transformer);
    });
};
```

Láthatjuk, hogy szépen egymásba pakolgatjuk az elemeket. Létrehozzuk a két különálló transformert, amik függőségek nélkül érkeznek. A UserTransformert beleinjektáljuk az SqlUserDao-ba, majd az SqlUserDao-t és a ProfileViewTransformer-t a LocalUserService-be, amit a UserViewFacade-be és végül azt a ProfileController-be. Ezután, ha kipróbáljuk a

```
php index.php
```

parancsot, akkor láthatjuk, hogy sikerült összeépítenie a dolgokat és a kimeneten pedig megjelent a kontroller által visszaadott view dumpja:

```
/home/tacsiazuma/shared/www/dummy-application/app/Application.php:26:
class Letscodehu\UserProfileView#5 (0) {
}
```

Na de hol kezdődik az a bizonyos flexibilitás? Tegyük fel, hogy bekövetkezett a cikk elején említett probléma, át kell kapcsolni a persistence réteget. Hozzuk is létre hozzá a rest-dummy-persistence-layer csomagot:

```
{
  "name" : "letscodehu/rest-dummy-persistence-layer",
  "version" : "1.0.0",
  "require" : {
    "letscodehu/persistence-layer-api" : "^1.0.0"
  },
  "repositories" : [
    {
      "type" : "vcs",
      "url" : "https://github.com/letscodehu/persistence-layer-api"
    }
  ],
  "autoload" : {
    "psr-4" : {
      "Letscodehu\\" : "src/"
    }
  }
}
```

Ez ugyanúgy az interfész csomagon fog dependálni, mint a másik implementációja. Egy osztály lesz benne összesen:

```
<?php

namespace Letscodehu;


class RestUserDao implements UserDao
{

    /**
     * Finds a User by it's ID.
     * @param $id
     * @return User
     */
    public function findOne($id)
    {
        // the rest implementation
        return new User();
    }
}
```

Nem megyünk most bele, hogy is kellene a klienst megírni, mert már így is túltoltuk a cikket, de a lényeg, hogy nem elég az új csomagot felvenni, használni is kell azt. Vegyük fel a dummy-applicationben. Ennek első lépése az lesz, hogy composerrel lehúzzuk az új csomagot, de azt be kell akkor írni a json-be. Írjuk át a repositories és a requre mezőben a dummy-persistence-layer-eket:

```
"require" : {
  "letscodehu/dummy-service-layer" : "^1.0.0",
  "letscodehu/rest-dummy-persistence-layer" : "^1.0.0",
  "letscodehu/dummy-presentation-layer" : "^1.0.0"
},
"repositories" : [
  {
    "type" : "vcs",
    "url" : "https://github.com/letscodehu/dummy-service-layer"
  },
  {
    "type" : "vcs",
    "url" : "https://github.com/letscodehu/rest-dummy-persistence-layer"
  },
  {
    "type" : "vcs",
    "url" : "https://github.com/letscodehu/dummy-presentation-layer"
  },
  {
    "type" : "vcs",
    "url" : "https://github.com/letscodehu/persistence-layer-api"
  },
  {
    "type" : "vcs",
    "url" : "https://github.com/letscodehu/service-layer-api"
  }
],
```

Ezután a composer update kidobja a régi és behúzza az újabb implementációt. Nyílván ezután a php index.php futtatása hibára fut, mivel olyan service-eket adtunk meg, amik nincsenek. A config.php-ből töröljük ki a korábbi UserTransformer és a UserDao service-ek definícióit és vegyük fel az új implementációját a UserDao-nak:

```
$container->put(UserDao::class, new \Letscodehu\RestUserDao());
```

Ezután futtassuk újra az index.php-t és láthatjuk, hogy hiba nélkül lefutott. Mi történt itt? Konkrétan csak lecsatoltuk a régit és felcsatoltuk az új implementációt és ezzel sikerült moduláris kódot alkossunk!

Az említett dummy-application megtalálható [itt](https://github.com/letscodehu/dummy-application), valamint a [letscodehu](https://github.com/letscodehu) nick alatt pedig a többi projekt is githubon.