---
id: 197
title: 'Tervezési minták &#8211; Adapter pattern'
date: '2015-01-29T22:35:24+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=197'
permalink: /2015/01/29/tervezesi-mintak-adapter-pattern/
dsq_thread_id:
    - '3467654150'
    - '3467654150'
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
    - Advanced
    - 'Design Pattern'
    - PHP
tags:
    - adapter
    - cache
    - design
    - incompatible
    - interface
    - pattern
---

Kicsit megtörjük most a sort és a létrehozási minták helyett (amik közül a jómunkásember Builder  
következne) egy másik csoportból fogunk elővenni egyet, mégpedig a struktúrális minták közül, az adapter pattern-t. Ezen mintának a lényege, hogy két inkompatibilis interfész között hidat képez. Minderre egy különálló osztályt fogunk használni, aminek az a feladata, hogy a két független vagy éppen inkompatibilis osztály funkcionalitását kombinálja.![1280px-Notebook-Computer-AC-Adapter](assets/uploads/2015/01/1280px-Notebook-Computer-AC-Adapter-1024x491.jpg)

A fenti kép is jó például szolgálhat. A laptopunk akkumulátorát és a konnektort egy adapter köti össze, ami a két összeférhetetlen "interfészt" fogja működőképessé tenni.

Ellenben írjunk egy példát, az mindig segít. Tegyük fel, hogy oldalunk egy külső API-t használ és ez a szolgáltatás lassú/netán nem mindig elérhető, így a tartalmát szeretnénk gyorsítótárazni, na meg az API kulcsunkat se akarjuk mindenáron pörgetni, nehogy túllépjük a limitet. Ezt a gyorsítótárazást először balga módon a fájlrendszerbe tesszük.

```
<pre data-language="php">class FileSystemCache {

    public function cacheToFile($key, $contentToCache) {
    // itt megy a magic: file_put_contents vagy hasonló barbárkodás :D
    }
    public function getFromFile($key) {} // ha már beletettük, szedjük is ki azt
    public function touch($key) {} // már nagyon profinak érezzük magunkat, ugye?:)
}

$cache = new FileSystemCache();
$cache->cacheToFile('rossz','megoldás');
```

A dolog rendkívül szimpla, példányosítjuk az osztályunkat, meghívjuk annak cacheToFile metódusát és máris felpörög a szerverünk winchestere (amit amúgy nem szeretnénk, de erről egy másik cikkben lesz szó).  
Telnek múlnak a napok, mire a kedves ügyfél megjegyzi, hogy bizony ez a folyamat lassú. Nem lehetne gyorsítani a dolgon? Utánajárunk és megdöbbenve tapasztaljuk, hogy a memória pár százszor gyorsabban dolgozik, mint a HDD (és az SSD-nek is odaver továbbra is), így inkább a memóriában kéne tároljuk a dolgot. Egyik kollégánk rögtön jön is az ötlettel, hogy biza ő nem nagyon konyít a PHP-hoz, de ha socketeket használunk, akkor neki bizony van egy key-value szervere, amit még kisovisként írt C-ben és szívesen rendelkezésünkre bocsájtja. Kapunk is az alkalmon és megírjuk rá az osztályunkat.

```
<pre data-language="php">class CacheLayerByRandomColleague {
     public function cacheToTheService($key, $value) {
         // itt is történik valami socket alapú feketemágia 3:)
     }
     public function getFromService($key) {
         // same here
     }
}
```

A fenti funkció hasonlóképp működik, mint amit az imént leírtunk, csak a funkciók neve és azok működése más, de lényegében ugyanazokat tudja. Telnek a napok és valaki egy checkout után meglátja, hogy mit műveltünk és a fejünkhöz vágja, hogy hát erre van a MemCached és miért nem azt használjuk. Aztán akkor írunk még 1 osztályt, ami azt használja, de lehet aztán kiderül, hogy túl sok mindent tárolnánk ott és inkább több rétegben cacheljük a dolgokat, netán más megoldással csináljuk és a végén lesz 20 féle osztályunk, amit 20 féleképp lehet használni. Ha emlékszünk az előző írásomra az interface-ekről és valami bizsergést érzünk az agyalapi részen, akkor jó úton járunk.

Ha a fenti osztályok mindegyikét mi írtuk, akkor segíthetünk magunkon úgy, hogy egy közös CacheInterface-t implementálnak. Ez is egy megoldás, de ez még nem lesz adapter pattern, mivel ott különböző interface-eket hozunk össze. Készítsünk először egy-egy interfészt a két megoldáshoz, hogy lássuk a dolog lényegét.

```
<pre data-language="php">interface MultiCacheInterface {
      public function getFromService($key);
      public function cacheToService($key, $value);
      public function getFromFile($key);
      public function cacheToFile($key, $value);
      public function touch($key);
 }
```

```
<pre data-language="php">class FileSystemCache implements MultiCacheInterface {
 // az interfész által előírt metódusok

   public function cacheToService($key, $value) {} // ez nem csinál semmit 

   public function getFromService($key) {} // ez se
}
```

```
<pre data-language="php">class CacheLayerByRandomColleague implements MultiCacheInterface
{
// az interfész által előírt metódusok

    public function cacheToFile($key, $value) {}
    public function getFromFile($key) {} // nem működnek
 }
```

Amint látjuk az osztályaink két különböző interfészt implementálnak, ezért az adatainkat különböző metódusok elérésével érjük el. Így a két megoldás közti váltáshoz bele kell nyúlni a kódunkba, mégpedig minden egyes helyen, ahol ezekre hivatkozunk. Ennek az áthidalásához készítünk most egy adaptert:

```
<pre data-language="php">interface StorageAdapter {
public function get($key);
public function set($key, $value);
public function touch($key);
}
```

Ugye itt csináltunk egy általános interfészt az adapterünknek.

```
<pre data-language="php">class CacheAdapter implements StorageAdapter {

    private $cacheService, $cacheType;      

    public function __construct($cacheType) {
        $this->cacheType = $cacheType;
        // ez egy nagyon egyszerű módszer lesz, meg lehet csinálni interface typehintelt constructor injectionnel is
        if ($cacheType == "filesystem") {
        $this->cacheService = new FileSystemCache(); // az átadott stringnek megfelelően példányosítjuk az osztályokat
        } 
        elseif ($cacheType == "randomcolleague") {
        $this->cacheService = new CacheLayerByRandomColleague
        } else throw new Exception('Unsupported cache type');
    } 
   
/*  Ez a megoldás egy fokkal stílusosabb 
   public function __construct(MultiCacheInterface $cache) {  typehinteltük az interfészt, így csak olyan osztályt fogad el, ami azt implementálta
     $this->cacheService = $cache;  // a typehint garantálja, hogy jó osztályt kaptunk
     $this->cacheType = get_class($cache); // kinyerjük az osztály nevét 
     } */

   public function get($key) {
        if($this->cacheType == 'filesystem') {
            $this->cacheService->getFromFile($key);
        } elseif ($this->cacheType == 'randomcolleague') {
            $this->cacheService->getFromService($key);
        }

   }
   // és a többi metódus
}
```

Na, kész is vagyunk, nézzük hát mit is csináltunk. Csináltunk egy interfészt a cache osztályunk számára, amit habár implementálnak, de az első megoldásnál nem feltétel ennek megléte, viszont a typehintelt konstruktor injectionnél már igen. A lényege a dolognak annyi, hogy egy réteget hoztunk létre a két osztályunk felé. A kliensnek nem kell ismernie azok interfészét, vagy épp típusát, mivel ezt a részét az adapter végzi. Ezen osztályunk tudja, hogy épp milyen cache-el van dolga és annak megfelelő metódusokat hív meg.

```
<pre data-language="php">$cache = new CacheLayerByRandomColleague();
$cache->getFromService($key);

$cache2 = new FileSystemCache();
$cache2->getFromFile($key);
```

Amint látjuk alapesetben így érjük el a két osztályt, különböző interfészeken, de az adapterünkkel ezt megoldottuk:

```
<pre data-language="php">$cache = new CacheAdapter("randomcolleague");
$cache2 = new CacheAdapter("filesystem");
$cache->get($key);
$cache2->get($key);
```

Így ha lesz egy osztály, ami a cache-ünket használja, nem kell átírnunk benne csupán egyetlen stringet és az adapterünk megteszi a többit helyettünk!