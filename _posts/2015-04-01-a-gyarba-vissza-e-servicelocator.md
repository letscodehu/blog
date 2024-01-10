---
id: 477
title: 'A gyárba vissza E! &#8211; ServiceLocator'
date: '2015-04-01T17:47:29+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=477'
permalink: /2015/04/01/a-gyarba-vissza-e-servicelocator/
dsq_thread_id:
    - '3809702960'
    - '3809702960'
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
    - Egyéb
tags:
    - service
    - servicelocator
    - servicemanager
    - zf2
---

Az alábbi cikk főképp azoknak lehet hasznos, akik:

<figure aria-describedby="caption-attachment-526" class="wp-caption aligncenter" id="attachment_526" style="width: 640px">[![Ő is épp egy service-t keres.](assets/uploads/2015/04/crash73-1024x735.jpg)](assets/uploads/2015/04/crash73.jpg)<figcaption class="wp-caption-text" id="caption-attachment-526">Ő is épp egy service-t keres.</figcaption></figure>

1. Használnak névtereket
2. Objektumorientált elvek mentén kódolnak,
3. Nem pár menüpontos microsite-ok jelentik a fő profiljukat,
4. <span style="text-decoration: line-through;">valamint szeretik a sört.</span>

A servicelocator-unk célja az lesz, hogy egyfajta <del>factory</del>cachelt key-value collection-t fogunk krealni, amiből az alkalmazásunk által használt osztályokat, "szolgáltatásokat" kérjük le.

##### Mi is lesz ennek a haszna?

A névterek használata során gyakran találkozunk a use kulcsszóval, amivel ha <span style="text-decoration: line-through;">jól</span> csináljuk, akkor autentikusan teleszemeteljük a fájljaink elejét. Ezt egy servicelocator használatával jócskán lecsökkenthetjük.  
A másik szempont az, hogy ugye az osztályainkra nem direkt hanem közvetett módon hivatkozunk, így ha unit tesztelésre kerül sor, akkor definiálhatunk a servicelocatorunk configjában mock objecteket.  
A másik szempont az lehet, hogy a servicelocator felkonfigurálva ad(hat)ja vissza az objektumokat, így már rögtön hasznalatra bírhatjuk őket.  
Na de hagyjuk ezeket az elméleti lehetőségeket, hanem rottyantsunk egyet össze magunknak!

Először is szükséges lesz egy config array, amiben tárolni fogjuk az egyes service-ek inicializálásának logikáját. Gondoljuk végig, hogy milyen service osztályokra lehet szükségünk? Mivel az adott kulcson nem űlhet maga az osztály, ezért legjobban az anonymous function-ök lesznek alkalmasak, amik visszatérési értéke a felkonfigurált osztálypéldány lesz.  
Az alábbi példa a ZF2-ben is megszokott asszociatív tömböt használja:

Az első fájl egy ún. globális konfiguráció, aminek a lényege az, hogy a környezettől független. Tehát ugyanazt használja a devszerver is, mint az éles vagy a preview/teszt.

```
// config.global.php
return array (
 'servicemanager' => array( // a confignak több kulcsa lehet, amiket szintén a servicemanager-en át érünk majd el, de erről később
// itt találhatók az egyes service-ek, amiket felkonfigolunk
       "problem" => function($sm) {  // ez egy anonymous function, aminek majd átadjuk a servicemanager példányát, így a closure-on belül elérünk más service-eket is akár.
                     $java = $sm->get('java'); // az átadott servicemanagerrel lekérünk egy másik service-t és beinjektáljuk az újonnan létrehozott Problem osztályunkba
                     $problem = new Problem($java); 
                     $problem->start();  // mivel Java-ról van szó, a probléma már el is kezdődött, így nyugodtan visszaadhatjuk
                     return $problem;
                    }
       "java" => function() { // itt nem kezdünk semmit a kapott paraméterrel, szimplán visszaadunk egy osztályt
                        return new Java();
                    },
       'mailer' => function($sm) {
                     $config = $sm->get('config'); // ezzel tudjuk lekérni az általunk definiált konfigurációt, ami szintén egy asszoc tömb lesz
                     $mailer = new PHPMailer(); // a jó öreg PHPMailer
                     $mailer->Username = $config['mailer']['username'];
                     $mailer->Host = $config['mailer']['host'];
                     $mailer->Password = $config['mailer']['password'];
                   }
       ),
 );


class Problem {

      private $started = false;// amíg nem indítottuk el, addig false is marad

      public function __construct(Java $java) { // typehinteljük a Java osztályt a konstruktorunkban, más funkciója nem lesz a konstruktornak
          
      }

      public function start() {
      $this->started = true; // átállítjuk a started értékét
      }

      public function isStarted() { // ezzel tudjuk leellenőrízni, hogy valóban lefutott-e a start metódusunk
          return $this->started;
      }
}

class Java {} // ez csak egy üres osztály lesz

```

Ez itt egy lokális konfiguráció lesz, ami az egyes környezetektől függően változhat. A két fájlon rekurzívan végigmegyünk majd és a lokális minden esetben felülírja majd a globális értékét.

```
// config.local.php

return array(
      'mailer' => array(
          'username' => 'dev',
          'host' => 'localhost',
          'password' => 'dev'
      ),
);
```

Ez pedig egy tesztkörnyezetre jellemző lokális config:

```
// config.local.php.test

return array(
      'mailer' => array(
          'username' => 'test',
          'host' => 'localhost',
          'password' => 'test'
      ),
);
```

Az egyes környezetekre jellemző lokális konfigokkal felül kell írni a config.local.php fájlt a deploy során (legyen az FTP, Samba, Git hook vagy Jenkins), mivel a rendszer a többit nem fogja látni.

Akkor most, hogy itt szétkonfiguráltunk mindent, jó lenne ezeket a dolgokat használni is.

```
class ServiceManager extends Singleton { // az egyszerűség kedvéért most singleton pattern-t aggatunk rá, így nem kell amiatt aggódni, hogy ha valahol meghívjuk, akkor nem lesznek benne a mi service-jeink, vagy hogy újra és újra berántja a config-ot.

            private $services, $config; // public properties are the root of all evil
     public function __construct() {
          if (!is_readable(APP_ROOT."/config/config.global.php") || !is_readable(APP_ROOT."/config/config.local.php)) { // ha a fájlok olvashatóak
          $global = include(APP_ROOT."/config/config.global.php"); // a php által visszaadott tömböt egy változóba töltjük
          $local = include(APP_ROOT."/config/config.local.php");
          } else throw new MalformedServiceConfigException(); // ha nem, akkor hajítunk egy jól szituált kivételt az ügyben
          $this->config = array_replace_recursive($global, $local); // a globalt felülírja a local konfig
          $this->services = array_key_exists('servicemanager', $this->config) ? $this->config['servicemanager'] : array(); // kinyerjük a service configot
     }

     // alább jöjjenek a tipikus key-value collection interfész metódusok
     public function get($key) {
          if ($key == "config") return $this->config; // ha a config-ra vagyunk kíváncsiak, akkor az egész összemergelt config tömböt visszaadjuk
          if (array_key_exists($key, $this->services)) {
               if (is_callable($this->services[$key])) { // ellenőrízzük, hogy egy anonymous function pihen-e az adott kulcs alatt
                    $obj = $this->services[$key]($this); // meghívjuk az adott callback-et és átadjuk neki a servicemanagert. 

               } else $obj = $this->services[$key]; // ha simán objektumot állítottunk be runtime a set-el, akkor csak kinyerjük onnan
               if (is_object($obj)) return $obj; // ha objektumot kaptunk vissza, akkor mehet a buli.
               else throw new ServiceNotFoundException("No object returned for service '$key'!"); // ha nem sikerült ojjektumokt kisajtoljunk, akkor valami balul sült el, erről nem árt tudatni a fejvesztőket.
          }
          else throw new ServiceNotFoundException(); // ha nem létezik a kulcs amit lekértünk, akkor a bulinak vége, persze itt is lehet kívülről konfigurálható a dolog, hogy az ilyen hibákat hogy kezeljük
     }

     public function has($key) { // ellenőrízzük, hogy az adott kulcs létezik-e
         return array_key_exists($key, $this->services); 
     }

     public function set($key, $service) {
         $this->services[$key] = $service; // ezzel tudunk runtime service-eket definiálni, amik később használhatóak lesznek, vagy a konfigurációjukat runtime végezzük
    }
}
```

Akkor nézzük, hogy mit is csináltunk az imént. A lényege az osztályunknak, hogy bárhonnan meghívható, a service-ek mindig rendelkezésünkre állnak majd a singleton viselkedésnek köszönhetően. Ahhoz viszont, hogy használni is tudjuk, valahol meg kell ezt hívjuk:

```
abstract class AbstractController { // hozzunk létre egy abstract controllert, ami a konstruktorában meghívja a servicemanagert
 
     protected $sm; // protected servicemanager példányunk

     public function __construct() {
        $this->sm = ServiceManager::getInstance(); // itt a servicemanager már meg is oldja amit meg kell, berántja a configot és hasonlók

     }
}

class TesterController extends AbstractController {

     public function __construct() {
         parent::__construct(); // ahhoz, hogy mi is betyárkodjunk, nem árt szólni apunak
         $problem = $this->sm->get('problem'); // itt kérjük le a configból a service-t.
         $this->sm->set('problem2', $problem); // itt pedig runtime akár hozzá is adhatjuk azt
         $problem2 = $this->sm->get('problem2');
         var_dump(get_class($problem)); // Problem
         var_dump($problem->isStarted()); // true
         var_dump(get_class($problem2)); // Problem
         var_dump($problem2->isStarted()); // true
     }

}
```

Fenti példában létrehoztunk egy absztrakt kontroller osztályt, amiből majd leszármaztathatjuk a kontrollerjeinket és ha meghívjuk a parent::\_\_construct()-ot, akkor bizony már el is érjük a servicemanagert. Itt aztán meghívjuk a configban már fel is lőtt problem kulcsot. Ez egy anonymous function, aminek átadja magát paraméterként a servicemanager. Ezt a paramétert használva lekérjük a 'java' kulcsot, amit beleinjektálunk a Problem osztályunk konstruktorába. Ha nem tennénk, hibát dobna a typehint miatt.

Ha ez megvolt, akkor a a start metódust is meghívjuk, így mikor visszakapjuk a service-t, akkor láthatjuk, hogy már el is indítottuk. Utána ezt visszatesszük egy másik kulcson, azt kikérjük és bumm, mindkettő ugyanazt az elindított példányt tartalmazza.

##### Problem?

A problémát az jelentheti, hogy az osztályaink függőségeit elrejtjük, így ha nagyon bonyolítjuk a dolgot, akkor nehezen átláthatóvá válik.

<figure aria-describedby="caption-attachment-527" class="wp-caption alignright" id="attachment_527" style="width: 640px">[![Nehogy így végezzük](assets/uploads/2015/04/problem-1024x576.png)](assets/uploads/2015/04/problem.png)<figcaption class="wp-caption-text" id="caption-attachment-527">Nehogy így végezzük</figcaption></figure>

Ráadásul<del>, habár PHP-re ez pont nem igaz,</del> a lefordított nyelveknél átverhető vele a fordító, hogy fordításkor ne dobjon hibát a program, hanem majd később futáskor.

> Ráadásul nem csak a compilert verhetjük át vele, hanem az IDE-t is, mivel szerencsétlen nem fog sok code assistance-t nyújtani, lévén ő se tudja, hogy mi a franc folyik itt. Szerencsére a legtöbb IDE lehetőséget biztosít különféle annotációkkal, hogy mégis felhomályosítsuk, mit is tartalmaz az adott változó, pl. a /\*\* @var \\Nevter\\Osztaly $valtozo \*/

A servicelocator persze ennél sokkal bonyolultabb is lehet, több részre oszthatjuk azt. Létrehozhatunk a servicemanager alatt egyéb kulcsokat, alias-okat, cache-elhetjük az egyes service-eket (ezáltal kiváltva egyfajta singleton behaviour-t azokból az osztályokból, amik egyébként nem lennének azok) vagy éppen szabályokat hozhatunk rá, hogy minden alkalommal új példányt adjanak (ahogy egy pl. factory tenné).
