---
id: 570
title: 'ZENDülés 1. rész &#8211; Skeleton application'
date: '2015-08-02T13:19:19+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=570'
permalink: /2015/08/02/zendules-1-resz-skeleton-application/
dsq_thread_id:
    - '3995735348'
    - '3995735348'
categories:
    - Backend
    - PHP
    - Zend
tags:
    - config
    - folders
    - routes
    - skeleton
    - zend
---

Amikor az ember belekezd a webfejlesztésbe és már némileg túllépett a "Hello world!" szinten, akkor ahogy sorra ontja ki magá[![soap_client_zend_framework](assets/uploads/2015/08/soap_client_zend_framework.jpg)](assets/uploads/2015/08/soap_client_zend_framework.jpg)ból a webalkalmazásokat, amiket autentikusan nulláról húz fel, akkor előbb - utóbb felfedez bizonyos ismétlődő részeket. Problémák/feladatok, melyekben szinte minden weboldala érintett. Ilyen lehet a jogosultság kezelés, a különböző támadások elleni védekezés, formok összeállítása, stb.  
A felismeréssel jó esetben rájövünk, hogy programjaink egyes részeit átemelhetnénk a következőbe, amit egy újabb probléma követ. Ugyanis ha az ember nem a modularitást szem előtt tartva fejleszt, akkor hajlamos "beledrótozni" mindent az adott metódusba/osztályba.  
Ekkor fejvakargatva refaktorálunk és a végén büszkén tekintünk a saját library-nk első komponensére.  
Ahogy telnek múlnak a hetek, egyre több és több modult emelünk át, míg végül egész szép kis gyüjtemény áll majd rendelkezésünkre, ami eszköztárat már-már keretrendszerként emlegethetünk. Azonban van ezzel egy kis baj... Ha valaki más be akar segíteni, akkor nincs egyszerű dolgunk, ugyanis mi nem dokumentáltuk a dolgot, nem teszteltük le az egyes komponenseket, így bizony el kell neki magyarázni hogy is épül fel a rendszer.  
Az ilyen problémákat képesek áthágni az ismert/jól dokumentált/tesztelt keretrendszerek. Ezeket emberek százai tesztelik/írják és a több szem többet lát elvet figyelembe véve, több hibát ki is purgáltak belőlük. Másrészt sokan használják öket, így az elsajátításukba feccölt idő sem elpazarolt, hiszen nem csak egy cégnél jelenthet ismeretük előnyt, a dokumentációról és a stackoverflow kérdés/válasz gyűjteményekről nem is beszélve.  
Ezért a következő lépés, hogy valamelyik ismert keretrendszert elsajátítsuk:  
Ebben segíthet ez a cikksorozat, ami a Zend Framwork 2 köré épül, ahol apránként végigvesszük a rendszer lényeges alkotóelemeit/lehetőségeit. Ezzel párhuzamosan fogok indítani egy Laravel 5-ös sorozatot is, mivel a Zend kevésbé elterjedt (habár mi azt használjuk).

#### Skeleton application

A Zend fejlesztői jófejek voltak és létrehoztak egy ún. Skeleton applicationt, egy vázat, amin pár dolgot előre bekonfiguráltak nekünk. Ahhoz, hogy használatba vehessük a keretrendszerünket, először is a saját gépünkön kell tudjuk azt. Erre több módszer is rendelkezésre áll.

#### Composer

Akinek nem tiszta a composer és annak működése, az elöször olvassa el ezt a cikket.

A composernek akad egy olyan parancsa, ami komplett projektek telepítésére szolgál és nem csak a vendor könyvtárunkat piszkálja. Ez a **create-project**. Több paramétere van, a kötelező természetesen az adott package neve. Mi egy specifikus könyvtárba akarjuk mindezt telepíteni, ezért a végére még hozzáfűzzük a könyvtár nevét is:

```
composer create-project zendframework/skeleton-application zend
```

#### Github

A githubon is megtalálható a cucc, viszont itt, jó keresztényhez híven a függőségek nincsenek fent, hiszen ezek menedzselésére a composert használjuk, így ha lehúztuk a repo tartalmát:

```
git clone https://github.com/zendframework/ZendSkeletonApplication.git
```

Akkor utána még vár ránk egy:

```
composer install
```

Ami telepíti a composer.json fájlból a szükséges fájlokat a vendor könyvtárunkba.

#### Get Leady!

A fenti parancsok valamelyikét követően, ha benavigálunk a zend nevű könyvtárba, akkor a következő látvány fogad minket:

```
/config
/data
/module
/public
/vendor
.gitignore
.gitmodules
composer.phar
composer.json
composer.lock
init_autoloader.php
README.md
license.txt
```

A fenti könyvtárak/fájlok közül jópár önmagáért beszél. Vannak itt git related fájlok, composer, a konfigja, valamint readme és licensz. Ezek bennünket nem annyira érdekelnek jelenleg. Először is meglepődhetünk, mert itt nem találunk .htaccess fájlt. Nos ez azért van, mert a DocumentRoot beállítás nem erre a könyvtárra fog mutatni, hanem a /public-ra, ezzel elkerülve a codeigniter 1-ből ismert minden könyvtárban külön htaccess fájl és a PHP fájlok elején pedig egy defined változóra vonatkozó if-elt die(). A /public-ot és alkönyvtárait leszámítva mindenhol az apache (vagy éppen nginx) alapbeállítása vonatkozik vagyis a "nincs itt semmi látnivaló".

Ahhoz, hogy a framework működjön, szükséges lesz az apache mod\_rewrite-ja, ugyanis minden kérés az index.php-n keresztül fog menni. Ezek prekonfigurálva már ott vannak a /public/.htaccess-ben.

Állítsuk is be a webszerverünk dokument root-ját a public könyvtárra, fingassuk újra azt és nézzük meg mit is mutat:

[![skeleton app](assets/uploads/2015/08/user-guide.skeleton-application.hello-world-1024x657.png)  ](assets/uploads/2015/08/user-guide.skeleton-application.hello-world.png)

Akkor nézzük meg, hogy mit hol találunk:

A vendor könyvtár értelemszerűen a külső 3rd party libeket foglalja magába. A public könyvtárat már megbeszéltük, minden fájl, ami direkt módon elérhető (képek, favicon, js, css, stb.) a kliensek számára itt lesz.

A data könyvtárba kerülnek a cache és log és egyéb fájlok (ha úgy konfiguráljuk) és legtöbb esetben a verziókövetését mellőzzük.

Az init\_autoloader.php az autoloaderek inicialiázálására szolgál (mily meglepő, ugye?). Ha van composer, akkor annak az autoloaderét használja, ha nincs, akkor a Zend AutoloaderFactory-ját.

A config könyvtárban a következőket találjuk:

```
/autoload 
application.config.php
```

Az application.config.php döntő szerepet játszik, mivel ha megnézzük az index.php utolsó sorát:

```
Zend\Mvc\Application::init(require 'config/application.config.php')->run();
```

Igen, ez a php fájl, habár nem függvény, mégis rendelkezik visszatérési értékkel, amit a require be is nyel és átad az application-nek. Nézzük meg, mégis mit adtunk át (a kikommentezett részek egy részét kivágtam):

```
<?php
return array(
 // This should be an array of module namespaces used in the application.
 'modules' => array(
 'Application',
 ),
// These are various options for the listeners attached to the ModuleManager
 'module_listener_options' => array(
 // This should be an array of paths in which modules reside.
 // If a string key is provided, the listener will consider that a module
 // namespace, the value of that key the specific path to that module's
 // Module class.
 'module_paths' => array(
 './module',
 './vendor',
 ),
// An array of paths from which to glob configuration files after
 // modules are loaded. These effectively override configuration
 // provided by modules themselves. Paths may use GLOB_BRACE notation.
 'config_glob_paths' => array(
 'config/autoload/{,*.}{global,local}.php',
 ),
 ),
);
```

A Zend framework konfigurációjára két módszer van. Az egyik a statikus konfig fájlokban, a másik pedig runtime bizonyos események triggerelésekor. A statikus fájlok minden esetben asszociatív tömbökkel térnek vissza, ahogy a fenti fájlban is látjuk.

##### Nézzük mi is folyik itt:[![hqdefault](assets/uploads/2015/08/hqdefault.jpg)](assets/uploads/2015/08/hqdefault.jpg)

Először is láthatjuk, hogy egy module-t felvettünk a listára. Ha modulokat hozunk létre, akkor ahhoz, hogy egyáltalán lássa a zend, hogy mindez létezik, azokat először itt kell felvenni. A skeleton application egy Application nevű module-al prekonfigurálva érkezik, amit itt be is kapcsoltak.

A következő helyen a relatív elérési utat állítjuk be, hogy hol is találjuk azokat a bizonyos modulokat. Ez jelen esetben a module és a vendor könyvtár. Ezeket általában nem piszkáljuk, hacsak nem akarjuk átszervezni a dolgainkat.

Az utolsó kulcson a konfigurációs fájlok helyét állítjuk be. A fenti reguláris kifejezés alapján a /config/autoload könyvtáron belül minden global.php és config.php-ra végződő fájlt beránt és azokat rekurzívan összemergeli, lévén tömbökről van szó. Tehát, ha felveszünk pl. egy mongodb.local.php-t, akkor azt is berántja a rendszer. Egy alapvető szabály van: a globális konfigok környezetfüggetlen beállítások, a local konfigok pedig környezetspecifikusak és ez utóbbi kulcsai felülírják az elsőt.

Ezért bevett szokás pl. a local.php-kat kivenni a verziókövetésből és itt tárolni pl. SQL, stb. eléréseket, jelszavakat.

#### Modulok

Mielőtt létrehoznánk egy új module-t, nem árt megvizsgálni, hogy mit is látunk egy már működő module-ban. Navigáljunk hát be a /module/Application-be és nézzünk szét:

```
/config
    module.config.php
/language
/src
    /Application
       /Controller
          IndexController.php
/view
    /application
       /index
          index.phtml
    /error
       404.phtml
       index.phtml
    /layout
       layout.phtml
Module.php
```

A config könyvtárban találhatjuk a module-unk statikus konfigurációját, ami szintén egy tömbbel visszatérő php fájl.

A modulunk runtime konfigurációit a Module.php-ban tudjuk majd elvégezni.

A language mappában po és mo fájlok találhatóak, amik a többnyelvűsítéshez kellenek majd.

Az src mappában találhatóak a konkrét forrásfájlok. Egyelőre csak egy IndexControllerünk van benne.

A view mappában vannak a template fájljaink. Ezeknek a struktúráját és elrendezését is sokféleképpen tudjuk konfigurálni, de majd erre is kitérünk. A Zend alapvetően natívan meghívja a phtml fájlokat és nem használ külön templatezőt, de beintegrálhatunk ilyet is természetesen, aki azt szeretné.

Nézzünk bele ebbe a module.config.php-ba!

```
return array(
   'router' => array(
     'routes' => array(
       'home' => array(
          'type' => 'Zend\Mvc\Router\Http\Literal',
               'options' => array(
                   'route' => '/',
                   'defaults' => array(
                      'controller' => 'Application\Controller\Index',
                      'action' => 'index',
                       ),
                    ),
                 ),
 // The following is a route to simplify getting started creating
 // new controllers and actions without needing to create a new
 // module. Simply drop new controllers in, and you can access them
 // using the path /application/:controller/:action
                'application' => array(
                   'type' => 'Literal',
                   'options' => array(
                      'route' => '/application',
                      'defaults' => array(
                      '__NAMESPACE__' => 'Application\Controller',
                      'controller' => 'Index',
                      'action' => 'index',
                    ),
                 ),
                 'may_terminate' => true,
                 'child_routes' => array(
                     'default' => array(
                         'type' => 'Segment',
                         'options' => array(
                            'route' => '/[:controller[/:action]]',
                            'constraints' => array(
                                'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                                'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                             ),
                             'defaults' => array(
                             ),
                          ),
                       ),
                    ),
                 ),
               ),
             ),
 'service_manager' => array(
     'abstract_factories' => array(
          'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
          'Zend\Log\LoggerAbstractServiceFactory',
     ),
     'aliases' => array(
         'translator' => 'MvcTranslator',
     ),
  ),
 'translator' => array(
     'locale' => 'en_US',
     'translation_file_patterns' => array(
         array(
             'type' => 'gettext',
             'base_dir' => __DIR__ . '/../language',
             'pattern' => '%s.mo',
        ),
     ),
 ),
 'controllers' => array(
      'invokables' => array(
          'Application\Controller\Index' => 'Application\Controller\IndexController'
       ),
    ),
 'view_manager' => array(
     'display_not_found_reason' => true,
     'display_exceptions' => true,
     'doctype' => 'HTML5',
     'not_found_template' => 'error/404',
     'exception_template' => 'error/index',
     'template_map' => array(
         'layout/layout' => __DIR__ . '/../view/layout/layout.phtml',
         'application/index/index' => __DIR__ .                  '/../view/application/index/index.phtml',
      'error/404' => __DIR__ . '/../view/error/404.phtml',
      'error/index' => __DIR__ . '/../view/error/index.phtml',
    ),
 'template_path_stack' => array(
     __DIR__ . '/../view',
     ),
 ),
 // Placeholder for console routes
 'console' => array(
     'router' => array(
       'routes' => array(
        ),
     ),
  ),
);
```

Akkor haladjunk szépen sorban kulcsonként:

##### Router

Ezen a kulcson meglepő módon a routerünket tudjuk konfigurálni. Vegyük figyelembe, hogy minden konfigurációs fájlban megtehetjük mindezt, mivel a Zend ezeket a php fájlokat összemergeli és abban fog aztán keresgélni, mikor egy request-et megpróbál belőni.

> Vigyázzunk, mert az összefűzött tömbökben ha ugyanolyan kulcsaink vannak, akkor azok felülíródhatnak. Tehát ha egyik fájlban a \["routes"\]\["home"\] kulcson van értékünk, egy másik ugyanilyen kulccsal azt felül tudjuk a module-on belül definiálni.

A "routes" kulcs alatt tudjuk felsorolni az egyes route-okat, amiket definiálni szeretnénk. Most a konkrét routing ba nem akarok belefolyni, mert ódákat lehetne róla zengeni, egyelőre legyen annyi elég, hogy itt tudjuk az egyes kontrollerekhez és azokon belül action-ökhöz (metódusokhoz) társítani őket. Megadhatunk plusz (akár opcionális) paramétereket, neveket rendelhetünk hozzájuk és aztán az adott action-ben le tudjuk majd kérni őket.

#### Service\_manager

Erről a bizonyos servicelocatorról írtam már korábban, hasonló konfigurációval. Itt tudjuk az adott module-ra specifikus service-eket beállítani.

#### Translator

A lokalizációért felelős beállítások találhatóak itt. Ha majd ideérünk, akkor részletesen kitárgyaljuk ennek a konfigurációs lehetőségét is.

#### View\_manager

A view-kal kapcsolatos beállítások találhatóak itt. Beállíthatjuk, hogy hol is találhatóak a view fájljaink, könyvtár szinten, action szinten, beállíthatunk error oldal template-eket is, azt is itt döntjük el, hogy a hibaüzeneteket mutassuk/ne mutassuk és még sok mást.

#### Controllers

Az egyes controllerjeinket tudjuk itt alias-okhoz rendelni, ami alias-okra a routingnál hivatkoztunk pl.

#### Console

Nem csak webalkalmazásokat lehet Zendre építeni, hanem CLI alkalmazásokat is, vagy akár vegyesen. Ennek a konfigurációjának az egyelőre üres helye található itt.

Akkor most nézzük azt a bizonyos Module.php-t!

```
namespace Application;

use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;

class Module {
     public function onBootstrap(MvcEvent $e)
     {
       $eventManager = $e->getApplication()->getEventManager();
       $moduleRouteListener = new ModuleRouteListener();
       $moduleRouteListener->attach($eventManager);
     }

     public function getConfig()
     {
       return include __DIR__ . '/config/module.config.php';
     }

     public function getAutoloaderConfig()
     {
       return array(
          'Zend\Loader\StandardAutoloader' => array(
             'namespaces' => array(
                __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
              ),
          ),
       );
    }
}
```

Ez már némileg rövidebb fájl és talán érthetőbb is. A Zend úgynevezett eventekre épül, tehát bizonyos események bekövetkeztekor az [observer pattern]({{ site.url }}/2015/06/16/observer-pattern-es-a-robotics-facility/) alapján meghívódnak bizonyos osztályokon metódusok. Ezeknek a neve általában "on"-al kezdődik. Ilyen a Module::onBootstrap(), a Controller::onDispatch() és még sorolhatnám.

Az **onBootstrap** a module indulásakor hívódik meg és paraméterként megkapja az MvcEvent példányt, amin aztán élesben láthatjuk, hogy is akasztja rá az observert az Eventmanagerre. Itt főleg ilyesmi történik, semmi erőforrásigényes, csak eventeket regisztrálunk.

A **getConfig**-ban láthatjuk, hogy itt van "bedrótozva" az iménti konfig fájlunk elérési útja.

A **getAutoloaderConfig**-ban pedig láthatjuk, hogy a fentebb említett src könyvtár struktúrája itt van beállítva. Ezt ha akarjuk mi is testreszabhatjuk, vagy hagyhatjuk így is.

Akkor nincs más hátra, ha nem szimpla templateket akarunk nézegetni, már csak egy kontrollerünk maradt a modulon belül:

```
namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class IndexController extends AbstractActionController
{
      public function indexAction()
      {
         return new ViewModel();
      }
}
```

Ez nem volt valami hosszú igaz?

Amint láthatjuk az IndexController az AbstractActionControllerből származik, ezáltal elég sok funkcióval/változóval már fel van ruházva, amikor "hozzánk kerül". Ha megnézzük fentebb a "home" route-ot, akkor láthatjuk, hogy erre a kontrollerre mutat és az index nevű action-re. Nos ez az indexAction() metódusunk lesz, ami semmit nem csinál, csak visszatér egy újonnan példányosított ViewModelel. Ennek a modellnek tudunk majd változókat átadni, amiket aztán a $this kontexten belül elérünk az adott templateben. Mivel a view\_manager már fel van konfigurálva, ezért az ehhez a fájlhoz tartozó template-et rögtön meg is találja, lefuttatja, a lefordított tartalmat letárolja egy változóban majd megkeresi a layout-ot (ez egyfajta header-footer együttes, amin belül kerül kirenderelésre az oldalspecifikus tartalom) és beilleszti abba, utána pedig visszaküldi a response-t. Persze mindezt SOKKAL bonyolultabb módon teszi meg, de egyelőre ne ugorjunk bele.

Legközelebbi alkalommal létrehozunk egy saját modult!
