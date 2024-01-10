---
id: 1081
title: 'Facade pattern'
date: '2016-04-04T23:07:45+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1081'
permalink: /2016/04/04/facade-pattern/
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
dsq_thread_id:
    - '4720364487'
    - '4720364487'
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2016/04/09202111/atm140120_20140120_202328_l.jpg'
categories:
    - PHP
tags:
    - design
    - facade
    - pattern
    - simplify
    - structural
---

Az elmúlt időszakban kissé eltávolodtunk a kódtól, pedig nem csak rendszerszinten lehet tekinteni itt a dolgokra, így most kicsit visszatérünk a hétköznapi kóder életbe, a tervezési minták világába. Cikkünk témája a facade pattern, aminek célja az, hogy a kliensek számára egy letisztult, egyszerűen használható interfészt biztosítson egy komplex objektumhálózat/modul használatához, miközben elburkolja annak működését. Besorálását tekintve a struktúrális minták közé tartozik, viselkedésében pedig kb. az Adapter ellentéte lesz.

<figure aria-describedby="caption-attachment-1082" class="wp-caption aligncenter" id="attachment_1082" style="width: 635px">[![atm140120_20140120_202328_l](assets/uploads/2016/04/atm140120_20140120_202328_l.jpg)](assets/uploads/2016/04/atm140120_20140120_202328_l.jpg)<figcaption class="wp-caption-text" id="caption-attachment-1082">Az ATM is egy facade</figcaption></figure>

Na most akkor nézzük milyen esetekben van szükség facade-ekre. Tegyük fel, hogy írtunk egy tök fasza library-t, ami kliensként szolgál egy Eureka service felé (amit egyébként tényleg könnyű megoldani). Mivel ezt minden microservice használni fogja, ezért nem árt, ha nem atomfizikusoknak van tervezve, de mi sajnos hithű Zend fanként írtuk meg azt, így a használata.. khm.. komplex 🙂 Ezt jelzik is a kollégák felénk<del>, amit mi egészen addig nem veszünk figyelembe, míg a resource manager szól ránk</del>. Nos akkor nincs más hátra, mint leegyszerűsíteni a dolgot számukra!

> Akinek új lenne: Az Eureka a Netflix serviceregistry toolja. Az a célja, hogy egy központi registry-ként szolgáljon és így a microservice-eknek nem kell tudniuk, hogy mely portokon ül a másik, hanem csak az Eureka címére lesz szükségük. Ő lesz az információs a pult a plázában. Az service-ünk odamegy, megkérdezi, hogy hol van az 576 kByte, az pedig megmondja (és fordítva).

Nos ez volt az egyik opció, tehát amikor szimplán akarunk egy leegyszerűsített interfészt biztosítani a kliensek számára. A másik egy fokkal komplexebb eset, amikor van egy <del>jól</del> működő legacy cuccunk, viszont a probléma az, hogy ezt még ükapáink írták és mi is csak hosszas agyalás után tudunk rájönni, hogy is kellene ezt jól használni. Ezért, mivel nincs időnk refaktorálni az egészet (?), hogy mutasson valahogy, amíg még képben vagyunk, csinálunk egy wrapper class-t, amin aztán szabadon betyárkodhatnak a többiek.

Na de akkor jöjjön valami konkrét példa is. Tegyük fel, hogy egy (nem magento) webshopot üzemeltetünk, ahol három nagyobb modul végzi a piszkos munkát egy-egy rendelés végbemenetelekor. Az első az InventoryService, ami ellenőrzi, hogy az adott termék raktáron van-e. A következő lépés a PaymentService, ami megpróbálja maffiamódszerekkel ellopni az EU-s pénzeket, a következő pedig a ShippingService, ami drónra ülteti a hőn áhított gamepadot.

Mindennek alapja a termék (a mai világban mi más lenne?)!

```
class Product {

    private $productId;
    private $name;

}
```

Nem lett valami bonyolult, de akkor jöjjön az őt magába foglaló rendelés (ami szintén apróság lesz)!

```
class Order {

    private $products = [];

    public function getProducts() {
        return $this->products;
    }

}
```

Hát ettől a classtól se megyünk a falnak, szimplán ki tudjuk kérni tőle a termékeket.

> Félreértések elkerülése végett: nem ennyiből állna ezen osztályunk, csak a példa kedvéért szükségesek

Na és most következzenek a fent említett service-ek lecsupaszított vázai:

```
// a raktárkészletért felelős
class InventoryService {

    public function checkAvailability(Product $product) {
        // ellenőrízzük a raktárkészletet
    }
}

// a fizetésért felelős
class PaymentService {

    public function submitPayment(Order $order) {
        // fizessük a bankon keresztül a rendelést
    }
}

// a szállításért felelős
class ShippingService {

    public function shipOrder(Order $order) {
        // a megrendelést szállítja
    }
}
```

Ugye ha a fentieket használni szeretnénk, akkor azokat megfelelő sorrendben, megfelelő paraméterekkel, stb. kellene elvégeznünk. Ez jelen esetben eléggé egyszerű, de sokkal bonyolultabb is lehetne. Ezt fogja megkönnyíteni a facade-ünk. Azonban mielőtt a konkrét osztályt létrehoznánk, gondoljunk a jövőre és csináljunk neki egy interfészt, ahogy a nagyok szokták és akkor a klienseink ezen interfésztől függnek, nem pedig a konkrét megvalósítástól:

```
interface OrderServiceInterface {
    public function makeOrder(Order $order);
}
```

A képlet egyszerű: a kliensünk átpasszolja az Order ojjektumot a facade-nek, az pedig megoldja a dolgot, mi pedig hátradőlhetünk.

```
class OrderService implements  OrderServiceInterface {

    private $shippingService, $paymentService, $inventoryService;

    public function setShippingService(ShippingService $shippingService) {
        $this->shippingService = $shippingService;
    }

    public function setInventoryService(InventoryService $inventoryService) {
        $this->inventoryService = $inventoryService;
    }

    public function setPaymentService(PaymentService $paymentService) {
        $this->paymentService = $paymentService;
    }

    public function makeOrder(Order $order)
    {
        $orderFullfilled = true;
        foreach ($order->getProducts() as $product) {
            if (!$this->inventoryService->checkAvailability($product)) {
                $orderFullfilled = false;
            }
        }
        if (!$orderFullfilled) {
            return false;
        }
        try {
            $this->paymentService->submitPayment($order);
            $this->shippingService->shipOrder($order);
        } catch (\Exception $e) {
            $orderFullfilled = false;
        }
        return $orderFullfilled;
    }
}
```

Nos mi is történik odafent? Megnézzük, hogy van-e raktáron termék, ha nincs, akkor már nem is próbálkozunk meg a többivel, utána pedig megpróbáljuk leemelni a pénzt, valamint drónra tenni a cuccot és a végén pedig visszajelzünk, hogy minden flottul ment. Akkor nézzük ezt használat közben:

```
public function checkout(Order $order) {
    $success = $this->getOrderService()->makeOrder($order);
    return view(($success ? "order.finish" : "order.error"));
}
```

Persze a használat is kissé leegyszerűsített. Most a különböző DI és hasonló dolgokba nem mentem bele, de gondolom látszik a lényeg. Ha valaki szeretné használni a fizetés modulunkat, akkor mostantól meg van könnyítve a dolga. Ennyire egyszerű lenne a facade pattern, persze ha valaki belenézett már pl. a Laravel dolgaiba, akkor tudhatja, hogy azért ez ennél jóval bonyolultabb is lehet.[![GIT](assets/uploads/2016/04/GIT.png)](assets/uploads/2016/04/GIT.png)

Ami problémát jelenthet az az, hogy mivel leegyszerűsítjük az interfészt, ennélfogva limitáljuk a használatot. Képzeljük csak el pl. a különböző IDE-kbe épített Git-et. Ugye sokmindenre jó, a legtöbb embernek elég, de aki jobban belemászott már a git dolgaiba, az ezen keresztül nem tud úgy "belenyúlni", annak marad a parancssor, vagyis a mi esetünkben az a bizonyos legacy kód és társai. Ilyenkor szoktak lehetőséget biztosítani a hardcore usereknek, hogy mégis elérjék a teljes funkcionalitást és ne csak a Facade-en keresztül tudják használni a komponenseket.
