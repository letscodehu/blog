---
id: 298
title: 'A Proxy Pattern szerepe az ókori rómában'
date: '2015-02-19T20:51:29+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=298'
permalink: /2015/02/19/a-proxy-pattern-szerepe-az-okori-romaban/
dsq_thread_id:
    - '3530528796'
    - '3530528796'
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
    - 'Design Pattern'
    - Intermediate
    - PHP
tags:
    - design
    - pattern
    - php
    - proxy
    - server
---

A mai témánk egy igen egyszerű, ám hasznos tervezési minta lesz, mégpedig a proxy. A név sokaknak  
ismerős lehet, akik próbáltak már céges netről betyárkodni és a dolog nem akart sehogy se összejönni nekik, mert egy bizonyos proxy lépett be a képbe. Na de mi is ez és mi célt szolgál? Cikkünkből megtudhatod!![ploxy](assets/uploads/2015/02/ploxy.jpg)

Ha fellapozzuk a [révai nagylexikont](http://hu.wikipedia.org/) a proxy szervernél, akkor azt olvashatjuk, hogy ez beépül a webszerver és a kliens közé és a kliens nevében kéréseket eszközöl a webszerver felé, gyorsítótáraz, megváltoztatja a kliens kérését vagy éppen a webhely válaszát. Akkor most jöjjön az, ami számunkra fontos:

A proxy pattern a struktúrális minták közé tartozik, lényegében egy olyan osztály lesz, mely interfészében azonos a fogadó osztállyal, ezáltal nem megkülönböztethető, a kliens nem tudja, hogy ő "csak egy proxyhoz" kapcsolódott. A proxy a metódusaival forwardolja a kéréseket és visszaadja a fogadó osztály válaszát.

Most akkor csináljuk meg a fent említett webszerver/kliens/proxy triumvirátust a proxy pattern elemeit bemutatva!

```
class Client { // ezek vagyunk mi

private $server;

public function __construct(ServerInterface $server) { // typehinteljük az interfészt

$this->server = $server; // sima konstruktor injectionnel adjuk át a szerver példányát

}

public function request($method, $url, $parameters) {

$this->server->incomingConnection($method, $url, $parameters); // nagyon leegyszerüsítve a dolog

}

}
```

Ebben eddig semmi érdekes nem volt, [typehinteltünk]({{ site.url }}/2015/01/21/oops-avagy-dependency-injection-praktikak/#typehint) a konstruktorban egy interfészt, így azon osztályok, amik implementálják azt az interfészt, hiba nélkül átadhatóak. Itt lesz a mi kis trükkünk, mivel mind a proxy, mind a webszerver osztályunk egyaránt implementálja majd az interfészt, ezáltal mindkettő használható lesz.

```
interface ServerInterface {

public function incomingConnection($method, $url, $parameters); // az interfészünk elég egyszerű lesz, egy metódust vittünk most bele

}
```

Nem is volt nehéz, ugye? Na de implementáljuk is ezt az interfészt a szerverünkben

```
class WebServer implements ServerInterface { // a webszerver osztályunk

public function incomingConnection($method, $url, $parameters) {

// mindenféle feketemágia, aminek révén visszaadunk egy választ

return $response;

}

}

class ProxyServer implements ServerInterface { // a proxy osztályunk, ami szintén implementálja az adott interfészt

public function __construct() {

$this->server = new WebServer(); // héé, ez már ismerős... a proxy elrakja magának a szerver egy példányát, mivel azon keresztül fog működni

}

public function incomingConnection($method, $url, $parameters) { // ugye a kötelező metódus

return $this->server->incomingConnection($method, $url, $parameters); // szimplán forwardoljuk a dolgot

}

}
```

A fenti példában jól látni miről is szól a proxy patternünk. Meghívunk egy osztályt, ami önmagában foglalja azt az osztályt, amit mi el akarunk érni és a kéréseinket továbbítja neki.

> Ezeket a kéréseket azonban meg lehet változtatni, valamint a válaszokat is, hiszen a proxy-n keresztülmegy a kérés.

Ha egyes osztályaink felé le akarjuk korlátozni a hozzáférést, akkor ilyen proxy-kon keresztül tudjuk elérni azt. Persze gyorsítótárazhatunk is, megvizsgálhatjuk ezt a kérést és még sok mást lehet beleszuszakolni ebbe a mintába, de most nézzünk pár példát mit lehet beletűzdelni:

```
class ProxyServer implements ServerInterface { 

     public function __construct(WebServer $server, CacheInterface $cache) {
        // valamilyen cache-t is hozzáadunk és DI-zzük a szerverünket
        $this->server = $server 
        $this->cache = $cache;
     }

     public function incomingConnection($method, $url, $parameters) { 
         if (!$this->allowed) return $this->getErrorPage(403); // ha nem engedélyezett, akkor a saját 403-as oldalunkat adjuk vissza
         $key = md5($method, $url, $parameters); // valami egyedi azonosítót generálunk, ennek a módszerét rátok bízom
         if ($this->cache->has($key)) {
            return $this->cache->get($key); // visszaadjuk cache-ből
         } else {
            $this->cache->set($key, $this->server->incomingConnection($method, $url, $parameters); // lementjük cache-be
            return $this->cache->get($key); // aztán visszaadjuk onnan
         }
     }
}
```

Ezek csak szimpla metódusok, sokminden variálható, de ne feledjük, hogy ez csak egy helyettes osztály, így ne vegye át a másik osztályunk munkáját, csupán a szerepét.
