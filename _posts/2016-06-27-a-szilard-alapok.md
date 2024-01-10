---
id: 1143
title: 'A szilárd alapok'
date: '2016-06-27T20:45:50+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1143'
permalink: /2016/06/27/a-szilard-alapok/
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
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2016/05/09202131/contentItem-3770797-22619864-m2hitxryp7wup-or.jpg'
categories:
    - Architecture
    - PHP
tags:
    - responsibility
    - single
    - solid
    - srp
---

Sok minden szóbakerült már a blogon, viszont egy igen fontos részt kihagytam, vagy csak érintőlegesen volt szó róla. Nem is biztos, hogy valaha direktben megkérdezik azt valakitől, hogy pontosan mit is takar a S.O.L.I.D., vagy éppen mit jelentenek az egyes rövidítések, ellenben előbb-utóbb az ember maga is elkezdi alkalmazni a legtöbb szabályt, amiről a cikkben szó lesz.[![contentItem-3770797-22619864-m2hitxryp7wup-or](assets/uploads/2016/05/contentItem-3770797-22619864-m2hitxryp7wup-or.jpg)](assets/uploads/2016/05/contentItem-3770797-22619864-m2hitxryp7wup-or.jpg)

> Mielőtt a Haskell fanok elkezdenének gyújtogatni, az alábbiak objektumorientált programozásról fognak szólni 🙂

A SOLID betűszó az objektumorientált programozásban már egy ideje létezik, az öreg [Bob bácsi](https://en.wikipedia.org/wiki/Robert_Cecil_Martin) tett róla, hogy megragadjon a fejekben. A szabályok, amiket takar, eléggé egyszerűnek hangzanak és arra hivatottak, hogy az őskáoszt, ami a fejekben és a kódokban lakozik kicsit rendbetegye.

Akkor nézzük meg egyesével őket, hogy pontosan miről is van itt szó?

**S = SRP = Single Responsibility Principle**

**O = OCP = Open Closed Principle**

**L = LSP = Liskov's Substition Principle**

**I = ISP = Interface Segregation Principle**

**D = DIP = Dependency Inversion Principle**

Lesz még pár hasonló, amiről írok, viszont azok már nem a SOLID részei.

### SRP

A definícióban ez áll:

> "A class should have only one reason to change.”

Hát ezzel nem vagyunk sokkal előrébb, nemde? Kicsit fordítottja annak, mint amit várnánk. A lényege annyi, hogy az osztályainknak csupán egy felelőssége legyen. Azáltal, hogy egy feladatot végez, csupán akkor kell belenyúlnunk az osztályba, ha ennek a feladatnak a logikája/megvalósítása megváltozik. Tehát csak ekkor "van oka az osztálynak megváltozni". Akkor most nézzük meg milyen is az SRP tipikus megsértése:

```
<?php

namespace System\StdLib\MvcEvent;

use System\Helper\Exception\Exception;
use System\Helper\Registry;
use System\Helper\Singleton;
use System\Helper\Config;
use System\Http\Request;
use System\Http\Router;
use System\Http\Controller\Plugin\Params;
use System\StdLib\MvcEvent\Exception\RoutingException;

class MvcEvent extends Singleton {

    private $router;

    public function start() {
        // main branching
        if (php_sapi_name() == "cli") {
            $this->consoleRequest();
        } else {
            $this->httpRequest();
        }
    }

    private function consoleRequest() {
        set_error_handler([$this, "errorHandler"], E_ALL);
        try {
            $this->router = \System\Console\Router::getInstance();
        } catch (Exception $e) {
            $this->showConsoleErrors($e);
        }

    }

    public function errorHandler( $errno ,$errstr, $errfile = null , $errline = null , $errcontext = array() ) {
        echo "Error occurred!".PHP_EOL;
        echo "Description:".PHP_EOL;
        echo $errstr. " on ".$errfile. " at line ".$errline.PHP_EOL;
        return true;
    }

    private function showConsoleErrors(Exception $e) {
        echo "Critical error occurred:".PHP_EOL;
        echo "Description:".PHP_EOL;
        echo $e->getMessage().PHP_EOL;
        echo $e->getTraceAsString().PHP_EOL;
        die();
    }


    private function httpRequest() {

        try {
            // call the router and check whether the given url can be matched to any route
            $this->router = Router::getInstance();

            // fill in the parameters
            $params = Params::getInstance();
            $params->setRequest(Request::getInstance());
            $params->setRouter(Router::getInstance());
            // call the given controllers given action
            $controllerName = $this->router->getController();
            $actionName = $this->router->getAction();
            // instantiate the controller
            if ($controllerName != "" && $controllerName != "\\" && class_exists($controllerName)) {
                $controller = new $controllerName;
            }
            else
                throw new RoutingException("The class '$controllerName' in routing configuration isn't exists", 404);
            // call the given action and get the viewmodel from it
            if (in_array($actionName,get_class_methods($controllerName))) {
                $controller->onDispatch($this);
                $view = $controller->$actionName();
            } else throw new RoutingException("The method '$actionName' isn't a callable!", 404);


            if (is_object($view) && in_array('System\StdLib\View\ViewInterface', class_implements($view)))
                $controller->getLayout()->render($view); // render with the given layout and view
            else throw new \Exception("No valid viewmodels returned. Returned viewmodels should implement 'System\StdLib\View\ViewInterface'");

        } catch (RoutingException $e)
        {
            try {
                Registry::getInstance()->set('message', $e->getMessage());
                Registry::getInstance()->set('trace', $e->getTraceAsString());
                $this->toRoute('404');
            } catch(\Exception $e) {
                header("400");
                die("Routing configuration error!");
            }

        }
        catch ( \Exception $e) {
            Registry::getInstance()->set('message', $e->getMessage());
            Registry::getInstance()->set('trace', $e->getTraceAsString());
            $this->toRoute('error');
        }
        // end
    }

    public function getRoute() {
        return $this->router->getRoute();
    }

    /**
     * The redirector method
     * @param string $routeName The route name specified in routing configuration
     * @param array $options Options to that route
     * @throws \Exception
     */
    public function toRoute($routeName, $options = array()) {
        $router = Config::getInstance()->get('router');

        // check if there is a route with that name in the configuration
        if (array_key_exists($routeName,$router['routes'])) {
            // literal route, so return the basepath to it
                if ($router['routes'][$routeName]['type'] == "Literal") {
                    $route['controller'] = $router['routes'][$routeName]['options']['defaults']['controller'];
                    $route['module'] = $router['routes'][$routeName]['options']['defaults']['module'];
                    $route['action'] = $router['routes'][$routeName]['options']['defaults']['action'];
                    Router::getInstance()->setRoute($route);
                }
                // segment route so build it by the segments given
                elseif ($router['routes'][$routeName]['type'] == "Segment") {
                    $options = array_merge($options, $router['routes'][$routeName]['options']['defaults']);
                    Router::getInstance()->setRoute($options);
                } else
                    throw new \Exception("Invalid configuration for route '$routeName'");
            
            
        } else 
           throw new \Exception("No route specified with name '$routeName'");

       try {
           $newrouter = Router::getInstance();
           // assign a new controller
           $controller = $newrouter->getController();
           // and action
           $action = $newrouter->getAction();
           if ($controller != "" && class_exists($controller)) {
               $c = new $controller;
           } else throw new RoutingException("The class '$controller' in routing configuration isn't exists", 404);
           $view = $c->$action();
           $c->getLayout()->render($view);
       } catch (\RuntimeException $e) {
           die($e->getMessage());
        }
    }
}
```

Na jó, ez a class talán kicsit túl is lőtt a célon 😀 Vegyük sorra a hibákat:

- Ha megnézzük, az alapelgondolás az volt, hogy osztály lenne az applikációnk belépési pontja, mert ott van egy start metódus, ami eldönti, hogy konzolból vagy épp cgi/fpm-en át hívtuk meg azt. Sajnos később ahelyett, hogy más osztályokat hoztak volna létre az adott feladatokra, elég sok mindent idezsúfoltak és végül a redirecten át a hibakezelésig, mindent itt végzünk.
- Mindennek tetejében még elég sok singletonnal is találkozunk itt, amik tovább nehezítik majd később a rendszer bővítését (pl. a Request egy HTTP request akar lenni, ami azáltal, hogy singleton, nem használható arra, hogy kifelé induló request-eket reprezentáljon, mert az aktuális bejövő http kérést hivatott reprezentálni.
- A kód alapjában véve kusza, ennélfogva nem egyszerű megérteni azt.

A single responsibility-nek leginkább azért van ellen, mert ha belegondulunk, hogy mivel elég sok mindent csinál az osztályunk, ezért sok esetben kell belenyúlni, míg ha egy jól körülhatárolható problémára építenénk azt, akkor ha hibát találunk benne, könnyen tudjuk azt lokalizálni. Így fejben kell tartanunk, hogy a routing, hibakezelés, redirect, stb. is itt van.

De nézzük inkább, hogy is lehetne ezt kipofozni!

Kezdjük a nevezéktannal. Ez itt nem egy MvcEvent. Az elnevezés a Zend Frameworkből származik (a koncepció azonban igencsak egyedi 😀 ), ahol egy-egy lekérést végigkövet egy esemény, aminek különböző életciklusaira fel lehet iratkozni. Itt is történik valami hasonló, de mérhetetlen zűrzavar közepette.

```
class Application {

    private function __construct() {   }

    public static function start() {
        $application = new self();
        // main branching
        if (php_sapi_name() == "cli") {
            $application->consoleRequest();
        } else {
            $application->httpRequest();
        }
    }
    
    private function consoleRequest() {
        // later
    }
    
    private function httpRequest() {
        // later
    }
}
```

Első lépésként létrehozzuk az Application class-t és kiemeljük bele a start metódust, mégpedig static-ként, amin belül példányosítjuk majd azt. Ez a példányosítás lehet már egyeseknek szintén plusz egy felelősséget takar, de pusztán annyi a lényege, hogy ez lesz az alkalmazás belépési pontja. (mint pl. javában is a main metódus). A start szimplán szétdobja a dolgot, aszerint, hogy CLI-ből vagy webszerver felől jött a kérés.

A toRoute metódus, ami igazából egy redirect, kikerülhet egy redirect osztályba, ami a response interfészt fogja implementálni, hiszen redirect válasszal is visszatérhetünk.

```
interface Response {
// a konkrét metódusokba még ne menjünk bele
}

class Redirect implements Response {
    /**
     * The redirector method
     * @param string $routeName The route name specified in routing configuration
     * @param array $options Options to that route
     * @throws \Exception
     */
    public function toRoute($routeName, $options = array()) {
           // ezt hosszú lenne rendbetenni és már nem az SRP-ről szólna
    }
}
```

Akkor jöjjön a következő két csúnyaság, mégpedig a hibakezelés. Két metódus is szerepel, ami hasonló dolgot végez. Az egyikük a console errorokat jeleníti meg, a másik pedig egy error handlerként funkcionál. Erre a célra, lévén elég sokféle lehet a hibák természetese és azok megjelenítési módja, szintén külön osztályokba tesszük:

```
interface ErrorHandler {
      public function handle(\Exception e);
}

class ConsoleErrorHandler implements ErrorHandler {
     // itt kezeljük le a konzolos hibákat
}

class HttpErrorHandler implements ErrorHandler {
     // itt pedig a http requestek során felmerülőket
}
```

A hibakezelés részét is levágtuk, marad a már megvalósított httpRequest metódus. Ez sem valami szép, ráadásul minden egybe van zsúfolva. Ahhoz, hogy a fent említett osztályok rendelkezésünkre álljon, szükségünk lesz majd egy service containerre, amiből mindezen osztályok egy példányát le tudjuk majd kérni, hogy használhassuk azokat és előtte fel kell őket tölteni is. A httpRequest tipikusan egy Dispatcher osztálynak való, ő lesz az aki a route alapján a megfelelő helyre irányítja a kérésünket. A controller pedig majd visszatér egy response-al, ami lehet pl. a fenti Redirect is akár. Nem áll szándékomban megoldani az egész rejtélyt, mert egy MVC framework alapjait kellene leírjam ide, amiért instant megköveznének, miszerint nem írunk saját keretrendszert 🙂 Ellenben érdemes tanulmányozni nagyobb rendszerek (pl. Zend, Laravel) kódját, mert sok szép megoldást találhatunk benne.

Az SRP lényege tehát az lenne, hogyha van egy osztályunk, ami X dolgot csinál, akkor ne azt bővítsük, amiért lusták vagyunk, hanem írjuk meg azt az osztályt, ami Y-ért felelős. Ennélfogva, ha Y megvalósítása módosul, akkor csak abban az egy osztályban kell majd átírni azt és nem pedig több helyen.

Ha valaki megkérdezi egy osztályunkról vagy metódusunkról (bár ez utóbbi már nem SRP, hanem clean code), hogy mit is csinál és mikor elmeséljük neki, használnunk kell az 'és', 'de' és hasonló kötőszavakat, akkor bizony nagy az esélye, hogy ott van mit darabolni. Ez kommentekben is elő tud jönni, pl.

```
// load and call the router

// validate, save
```

Persze akad, amikor jól elnevezzük a metódust és itt látszik majd a hiba:

```
public function getAndCheck(...);

public function generateAndSaveThumbnails(...);
```

Legközelebb az OCP-ről és a többi elemről lesz szó, de addig is mondd el mit gondolsz a fentiekről, netán milyen csúnya refaktor élményeid vannak!
