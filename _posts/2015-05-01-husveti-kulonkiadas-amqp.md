---
id: 376
title: 'Húsvéti különkiadás &#8211; AMQP'
date: '2015-05-01T15:35:18+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=376'
permalink: /2015/05/01/husveti-kulonkiadas-amqp/
dsq_thread_id:
    - '3728163352'
    - '3728163352'
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
    - PHP
tags:
    - amqp
    - composer
    - job
    - php
    - queue
    - rpc
    - videlalvaro
---

**Mivel vége lett az elmúlt hetek epikus hajtásának, ezért most fogom elkezdeni bepótolni a finomságokat, úgyhogy a napokban visszatér a már megszokott 2-3 poszt/hét tempó.![rabbitmq](assets/uploads/2015/04/11132060_10203794789852760_1173878057_n.jpg)**

Ha már az egyik korábbi cikkemben kitárgyaltuk a vérnyulak szaporodási ciklusát, akkor most azünnepek alkalmából egy újabb nyulas cikket tálalnék. A hálózati kommunikáció különböző szabályokat, úgynevezett protokollokat követ. Ilyen protokoll a TCP, HTTP, SMTP, hogy soroljak pár ismertebbet.  
Mai témánk egy kevésbé ismert protokoll lesz, mégpedig az AMQP, azaz az advanced message queueing protocol.

Nevéből is kitűnik, hogy ez egy üzenetek továbbítására és sorbaállítására szolgáló protokoll. A lényege, hogy van egy adott porton/hoston futó service, amivel a memcachedhez hasonlóan egy erre a célra kitalált library használatával kommunikálunk.

##### RabbitMQ

Egyik ilyen opensource service a [RabbitMQ](https://www.rabbitmq.com/), amit mi is használni fogunk, mégpedig a debian/ubuntu verziót, de szinte az összes platformra kiadták. A program <del>Őrlángban</del> Erlangban íródott és igen jól optimalizálták.

**Update:** Debian 6.0-tól és ubuntu 9.04-től felfelé már alapból jön egy rabbitmq server, igaz elég régiek, úgyhogy azokat inkább hagyjuk, mert a letöltés sem fene bonyolult.

Két módszerrel tudjuk a gépünkre varázsolni, az egyik egy szimpla [letöltés](https://www.rabbitmq.com/install-debian.html), a másik az APT repository. Mivel a legtöbben nem fogják direktbe kitenni egy prod szerverre, ezért ne szemeteljük tele az APT repo listáját, maradjunk egy szimpla wget-nél (vagy kattintsunk a letöltés linkjére, kinek mi tetszik).

```
wget https://www.rabbitmq.com/releases/rabbitmq-server/v3.5.1/rabbitmq-server_3.5.1-1_all.deb
```

Miután elindítjuk a telepítőt, futnak le a sorok és a végén ott állunk majd, hogy oké, hogy ez így elvileg megy a gépen, de mégis.. honnan tudom, hogy tényleg megy, egy ps | grep kombót leszámítva? Szerencsére erre gondoltak a fiúk és vannak hozzá pluginek, ami pluginek egyike a Web UI-s management. Ahhoz, hogy ezt fellőjük egy szimpla parancsot kell superuserként kiadni:

```
rabbitmq-plugins enable rabbitmq_management
```

Ez aktivál még pár szükséges plugint a műküdéshez és ha nem csücsül semmi az 5672-es porton, akkor el is indul. Innen kezdve az admin felületet a http://*hostname*:15672-es címen tudjuk elérni, alapesetben guest-guest felhasználónév jelszó kombóval. Erre majd visszatérek még később.

##### Videlalvaro

Ha PHP-re akarjuk feltolni ezt a cuccot, akkor a [Videlalvaro ](https://github.com/videlalvaro/php-amqplib)féle library kell nekünk. Amennyiben <del>okosak és ügyesek voltunk</del> a projektünk composert használ, ergo viszonylag egyszerűen le tudjuk rántani a dolgot. Az alábbi sort írjuk be a composer.json-be:

```
  <span class="pl-s"><span class="pl-pds">"</span>videlalvaro/php-amqplib<span class="pl-pds">"</span></span><span class="pl-k">:</span> <span class="pl-s"><span class="pl-pds">"</span>2.2.*<span class="pl-pds">"</span></span>
```

aztán a konzolban toljunk egy composer install-t és bumm, máris machinálhatunk a dolgon!

Írjunk hát egy script-et, ami feltol egy egyszerű üzenetet a queue-ba:

```
use PhpAmqpLib\Connection\AMQPConnection; // ez lesz maga a csatlakozási pontyunk
use PhpAmqpLib\Message\AMQPMessage; // ez az üzenet, amit feltolunk a queue-ba


// ezúttal eltekintek az OOP szemlélettől, mindenki úgy erőszakítja bele egy osztályba a dolgot, ahogy szeretné (amíg nem a controllerben végzi azt  )
class AMQP {

    private $connection;

    public function __construct(array $configarray) { // átadunk a konstruktorunknak egy tömböt, amiben a config van, basic DI
       $this->connection = new AMQPConnection($configarray['host'], $configarray['port'], $configarray['username'], $configarray['password'] ); // ezzel csatlakoztunk az adott porton futó service-hez.
    }

    public function send($message) { // küldjünk egy aktivációs levelet, de egy blocking e-mail küldés helyett dobjuk be AMQP-be és a túlvégen ülő consumerünk fogja megenni azt és kiküldeni a tényleges levelet
      $amqpmess = new AMQPMessage(json_encode($message)); // létrehozunk egy új üzenetet és a tartalmat átadjuk neki JSON stringgé kódolva
      $channel = $this->connection->channel(); // megnyitunk egy csatornát a service felé
<span class="x">    $channel->queue_declare('email', false, false, false, false); // a csatornán belül létrehozunk egy várakozási sort (ha még nincs ilyen)</span>
       $channel->basic_publish($amqpmess, '', 'email');  // majd felküldjük az üzenetet.
       $channel->close(); // végül lezárjuk a csatornát
 }

}

// akkor most hívjuk meg a dolgot

$config = array(
'host' => 'localhost',
'port' => 5672,
'username' => 'guest',
'password' => 'guest'
 );

$amqp = new AMQP($config);  // példányosítjuk az ojjektumunkat
$message = array (
 'email' => 'info@letscode.hu', // a cím ahova küldjük az aktivációt
 'lang' => 'hu', // a nyelv, ami alapján az e-mail template-t kiválasztjuk
 'name' => 'Papp Krisztián',  // a név, akinek megy az aktiváció
 'date' => date('Y-m-d H:m:s', time()); // a regisztráció dátuma
 'link' => '{{ site.url }}/does-not-work/afe3233ad46fe7f4e62fd' // az aktivációs link
  'type' => 'activate', // a kiküldendő e-mail típusa
  'tries' => 0 // a próbálkozások száma
 ); // ezzel az üzenetünk meg is van
$amqp->send($message); 

```

A fenti kóddal megnyitottunk egy kapcsolatot az AMQP felé, majd felküldtünk egy üzenetet a várólistára. Ha megnyitjuk a webes interface-t a 15672-es porton, akkor a queue-k között találunk egy 'email' nevűt, valamint a dashboard-on ott fog virítani egy piros csík, jelezvén, hogy van egy feldolgozatlan üzenetünk, sőt a queue menüpont alatti get messages gombbal meg is nézhetjük annak tartalmát.

##### Oké, de hogy lesz ebből e-mail?

Mint tudjuk minden sornak két vége van, a végén vannak <del>azok akik szívnak</del> az üzenetek, az elején pedig a <del>pénztáros</del> az ún. consumerek, amik pac-man módjára zabálják az üzeneteket. Egy ilyen consumert sem egy ördöngősség fellőni, viszont a kulcsszó jelen esetben ott van, hogy ez nem weben, hanem egy a háttérben futó service legyen. Itt jöhet jól az ún. supervisord (amiről szintén írni fogok), ahol webes felületről tudunk programokat a háttérben futtatni, valamint elvégzi a process-ek újra fellövését, stb, aki viszont nem akar ilyet használni, annak ajánlom [ezt]({{ site.url }}/2014/12/24/daemon-idezes-php-ben/) a cikket.

Az egyszerűség kedvéért most simán parancssorban futtatjuk és figyeljük a kimenetet. A fenti script-et kössük be valamelyik aloldalunkra és figyeljük mi is történik a terminálban (Figyelem: az alábbi kódban nem kapcsoltam ki az output-ot, valamint át sincs irányítva logfájlba, hogy lássuk mi is történik, de ez egy daemon esetében nem járható út.)

```
use PHPMailer; // a jó öreg phpmailerrel fogjuk küldeni az üzenetet
use PhpAmqpLib\Connection\AMQPConnection; // a connection-re itt is szükségünk lesz
use PhpAmqpLib\Message\AMQPMessage; // valamint az üzenetre is, hogy sikertelenség esetén újra sorbaállítjuk az üzenetet.


class Consumer {

 private $connection;

    public function __construct(array $configarray) { // átadunk a konstruktorunknak egy tömböt, amiben a config van, basic DI
       $this->connection = new AMQPConnection($configarray['host'], $configarray['port'], $configarray['username'], $configarray['password'] ); // ezzel csatlakoztunk az adott porton futó service-hez.
    }       public function run() {<span class="x">               $channel = $this->connection->channel(); // megnyitjuk a csatornát            
               $channel->basic_consume('email', '', false, true, false, false, [$this, 'process']); // aztán rácsücsülünk</span>

                      while(count($channel->callbacks)) { // ha jön üzenet meghívjuk a process metódusunkat
<span class="x">                  $channel->wait(); // és két üzenet közt várunk</span>
               }
              public function process($msg) {
                  $message = json_decode($msg->body); // az üzenet törzse érdekel bennünket, mégpedig visszakódolva tömbbé
                      switch($message['type']) { // a típusa alapján hívjuk meg az adott e-mail küldő metódusunkat
                             case "activate" :  $this->activate($message); // aktivációs levelet kell küldenünk
                                break;
                             default: echo "Malformed message!";
                      }   
              }
              public function activate($message) {
                         $mailer = new PHPMailer();
                         // itt elvégezzük a mailerünk konfigurációját
                         // a lang alapján válasszuk ki a mail template-t és küldjük ki az e-mailt, ha még nem érte el a próbálkozások maximális számát
                         if (!$mailer->send()) { // sikertelen volt az üzenetküldés
                             $message['tries'] = $message['tries']++; // jelezzük, hogy már megpróbáltuk elküldeni
                             $this->requeue($message); // újra sorbatesszük az üzenetet
                         } 
              }
}


// akkor most hívjuk meg a dolgot

$config = array(
'host' => 'localhost',
'port' => 5672,
'username' => 'guest',
'password' => 'guest'
 );

$amqp = new Consumers($config);  // példányosítjuk az ojjektumunkat
$amqp->run();
```

A fentiekben elindítottunk egy egyszerű programot, ami végtelen ciklusban várja az üzeneteket és feldolgozza azokat. Kiküldi a megfelelő e-mailt a megfelelő helyre, a megfelelő nyelven, ha pedig sikertelen, akkor újra sorba állítja azt és újrapróbálkozik párszor. Mi is ennek a lényege? A felület fluiditása. Az e-mail küldés egy blocking folyamat, ráadásul ha valami timeout és hasonlók miatt nem sikerül és esetleg újrapróbálnánk, azt továbbra is a felhasználói élmény kárára tudjuk megtenni. Ez viszont egy aprócska információ csomag, amit felküldünk és a háttérben kezelünk, így a felhasználót nyugodtan redirektálhatjuk egy "megnyugtató" oldalra 🙂  
Hogy ezeket az üzenetküldő protokollokat mire is akarjuk használni, csak a képzeletünk szabhat határt, most csak egy egyszerű esetet tártam fel.
