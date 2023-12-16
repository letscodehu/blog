---
id: 1187
title: 'Law of Demeter &#8211; Ne állj szóba idegennel!'
date: '2016-07-17T19:14:57+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1187'
permalink: /2016/07/17/ne-allj-szoba-idegennel/
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
image: 'assets/uploads/2016/07/09202145/Szeged-domotor.jpg'
categories:
    - 'Design Pattern'
tags:
    - demeter
    - design
    - dont
    - law
    - of
    - strangers
    - talk
    - to
---

Az utolsó design cikkhez értünk, ez a SOLID utáni ráadás. Law of Demeter, más néven a principle of least knowledge egy ajánlás a szoftverfejlesztéshez, azon belül is az objektumorientált nyelvekhez. Ha valaki találkozott már a kódjában hosszú method chainingel, mint például:

```
<pre data-language="php">$user = $this->getServiceLocator()->get("SqlModelFactory")->createModel("Users")->findById($ID); // félreértés ne essék, nem minden method chaining lesz "rossz"
```

<figure aria-describedby="caption-attachment-1188" class="wp-caption aligncenter" id="attachment_1188" style="width: 298px">[![Szeged-domotor](assets/uploads/2016/07/Szeged-domotor-768x1024.jpg)](assets/uploads/2016/07/Szeged-domotor.jpg)<figcaption class="wp-caption-text" id="caption-attachment-1188">A szegediek lehet értik</figcaption></figure>

akkor valószínűleg nem árt, ha olvassa ezt 🙂

A Law of Demeter (későbbiekben LOD) a SOLID elvekhez hasonlóan a loose couplingot hivatott elérni, azonban itt nem az objektumok egymás közti viszonyáról lesz szó, hanem az objektumok működéséről, hogy hogyan is lépjenek interakcióba egymással azok a bizonyos objektumok. Ezt a törvényt ( ami igazából nem is törvény, hanem vegyük inkább ajánlásnak) 1987-ben, a Northeastern University-n mutatták be és az alábbi három ponttá lehetne összegyúrni:

- Minden elemnek limitált információi lehetnek a többi elemről: csak a hozzá "közel álló" elemekről
- Minden elem csak a barátaihoz beszélhet, ne állj szóba idegennel!
- Csak a közvetlen barátaiddal beszélj.

![WK25x7t](assets/uploads/2016/07/WK25x7t.png)  
Ez egy kicsit furán hangzik elsőre, de később majd részletezzük, hogy miről is van szó. A lényege annyi lenne, hogy az objektumaink a saját tagváltozóikat/metódusaikat tartsák meg minél jobban maguknak. Minél inkább feltételezésekbe bocsájtkozunk egy komponens fejlesztésekor, hogy pl. a kapott objektumtól elkérjük ezt az objektumot, amitől elkérjük ezt, amitől elkérünk mást, hogyha valahol épp az nincs beállítva, akkor bizony akkora NullReferenceException-t dob, mint ide Mátészalka. Nem beszélve arról, ha az említett objektumot kicserélik valami másra, ami másképp működik.. de ne rohanjunk ennyire előre.

> A nevét egyébként a projektről kapta, ahova kitalálták, a Demeter projectről (ami pedig a görög Demeter istentől ered).

#### Demeter törvénye az objektumorientált világban

Tegyük fel, hogy van három objektumunk: TaxiDriver, Customer, Wallet. A "törvény" értelmében a TaxiDriver egy metódusában hozzáférhet a Customer objektumhoz, ellenben a Customeren keresztül annak Walletjét már nem érheti el. Ha így tenne, akkor implicit módon mélyebben kellene ismernie az adott objektum belső szerkezetét. Hogy ezt elkerüljük, két módszer áll rendelkezésünkre. Az egyik, ahol a TaxiDrivernek közvetlen referenciája van a Walletre... (ez már a zsebtolvajlást súrolja), vagy a másik, amikor a Customer egyik service-én keresztül érjük el a Wallet-et (itt nem közvetlen getterről van szó továbbra sem). De nézzük mit is szabadna tennünk a lenti esetben (egy objektum egyik metódusában mihez férhetünk hozzá)?

```
<pre data-language="php">class TaxiDriver {

    private $money;

    public function collectMoney(Customer $customer) {
         // itt leszünk mi
    }
}
```

1. A saját objektumunkhoz, jelen esetben a $this-hez.
2. Az adott metódus paramétereihez, jelen esetben a $customer objektum.
3. Bármelyik objektum amit a metóduson belül példányosítok
4. A TaxiDriver közvetlen komponensei, pl. a $money property.
5. A TaxiDriver számára elérhető globális változók, az adott metódus scope-jában.

Ha leegyszerűsítjük, akkor mondhatjuk azt, hogy szinte bármihez hozzáférhetünk, kivéve a kapott objektumokon meghívott metódusok által visszaadott objektumok metódusait. Tehát $customer->pay() metódusa még belefér, de a $customer->getWallet()->valamiMetodus() már nem.

> A Java, C#, stb. világában az objektumreferenciákon való hivatkozásokat nem -> -al, hanem ponttal választjuk el, ezért elterjedt a "one dot rule" elnevezés is a demeter törvényére, ami nem minden esetben igaz, de nézünk erre is példát.

Akkor most nézzünk megint példákat a legrosszabbtól a legjobbig:

```
<pre data-language="php">class TaxiDriver {

     private $money;
     private $fee = 1150;

     public function collectMoney(Customer $customer) {
          $actualFee = ($this->fee * rand(1,4));
          $customer->getWallet()->money -= $actualFee);
          $this->money += $actualFee;
     }
}

class Wallet {
     public $money; // minden gonosz gyökere: publikus tagváltozók
}

class Customer {
     private $wallet; // ez legalább már private

     public function getWallet() { 
         return $this->wallet;
     }
}
```

Akkor nézzük mi is történik a fenti példában! Hát ez egy szokásos rablásnak tűnik, bár kérdés mivel fenyegetnek meg bennünket, mert kérdés nélkül odaadtuk a pénztárcánkat a taxisnak, aki így nem csak azt tudta megnézni, hogy mi is van benne, de annyit vesz ki belőle amennyit nem szégyell. De kicsit eltekintve az etikai részétől, azért sérti a LOD-ot, mert egy olyan objektumon végzünk módosításokat, amire nincs közvetlen referenciánk.

<figure aria-describedby="caption-attachment-1193" class="wp-caption aligncenter" id="attachment_1193" style="width: 468px">[![Taxi](assets/uploads/2016/07/taxis-1024x683.jpg)](assets/uploads/2016/07/taxis.jpg)<figcaption class="wp-caption-text" id="caption-attachment-1193">Taxi</figcaption></figure>

Na de akkor jöjjön a gyógyír, legalábbis amit elsőre jónak hiszünk. Delegáljuk a dolgokat!

```
<pre data-language="php">class TaxiDriver {

     private $money;
     private $fee = 1150;

     public function collectMoney(Customer $customer) {
          $actualFee = ($this->fee * rand(1,4));
          $customer->setMoney($customer->getMoney() - $actualFee); // hát most se jártunk jobban, 5950.. számla nélkül 
          $this->money += $actualFee;
     }
}

class Wallet {
     public $money; // minden gonosz gyökere: publikus tagváltozók
}

class Customer {
     private $wallet; // ez legalább már private

     public function getMoney() { // a money változó hozzáférését biztosítjuk
         return $this->wallet->money;
     }

     public function setMoney($money) { // itt lehet mókolni a tárcánkban
         $this->wallet->money = $money;
     }

}
```

Na nézzük miben lett másabb a dolog? Ránézésre már nem sérti a LOD-ot.. Hurrá! De várjunk, ez még mindig nem az igazi. A taxis továbbra is direktben piszkálja a nálunk lévő Deák Feri bácsit, azért ez mégsincs jól, nemde? A probléma itt az, hogy property-t delegáltunk és habár jónak tűnik a megoldás, ilyet még mindig nem szabad. Behavior-t szabad delegálni, tehát egy metódust kell előrébb rángatnunk, nem pedig property elérést.

```
<pre data-language="php">class TaxiDriver {

     private $money;
     private $fee = 1150;

     public function collectMoney(Customer $customer) {
          $actualFee = ($this->fee * rand(1,4));
          $this->money += $customer->pay($this->actualFee);
     }
}

class Wallet {
     private $money;
     
     public function withdraw($amount) { // itt lehet pénzt kivenni a tárcánkból
         if ($this->money < $amount) 
             throw new InsufficientFundsException(); // ha többet akarunk, akkor biza exception lesz!
         $this->money -= $amount;
         return $amount;
     }
}

class Customer {
     private $wallet;

     public function pay($amount) {
          return $this->wallet->withDraw($amount);
     }
}
```

Apró módosítást végeztünk, viszont szemmel látható a különbség. Mostmár semmi olyanhoz nem férnek hozzá közvetlenül, amihez nem szabadna, a LOD-ot is betartjuk, összességében egy jobb, flexibilisebb design felé haladtunk. Persze az is tény, hogy sok metódust kell így delegálni, több idő mehet el a kódolással, de a minőségnek ára van.

A Taxis mostmár tudja, hogy a Customernek van egy metódusa, amivel fizetni tud, viszont azt már nem tudja, hogy miből fizeti ki. Ahhoz semmi köze.

#### Na de mi a helyzet a fluid API-val?

```
<pre data-language="php">$requestBuilder->setUri($uri)->setMethod("POST")->setTimeout($timeout)->build();
```

A fenti példa első ránézésre csúnya violationnek tűnhet, azonban mégsem az. Ha megvizsgáljuk, a setUri, setMethod, stb metódusok nem egy új objektumot adnak vissza, hanem az eredeti RequestBuildert, tehát végig azon hívjuk a metódusokat, ami így már nem sérti a LOD-ot.

#### És a view fájlokkal?

Tegyük fel, hogy van egy Order modelünk, aminek van egy Customer many-to-one relationje. Itt szeretnénk az adott megrendeléshez tartozó vevő nevét kiírni a view-ban:

```
<pre data-language="php">{{ $order->customer->name }}
```

Hoppá.. ez itt sérti a LOD-ot! Vagy mégsem? Lévén itt view fájlokról beszélünk, itt nem érvényesül törvény, mert nem végzünk műveleteket vele, valamint itt maximum property delegálás lehetne, amit pedig már fentebb megbeszéltünk, hogy nem javasolt.

Remélem sikerült valamennyire bemutatnom azt, amit a Wikipédia is próbál, talán jobban. A legfontosabb azonban, hogy erre a nevével ellentétben ne törvényként tekintsünk, hanem inkább egy ajánlásként.