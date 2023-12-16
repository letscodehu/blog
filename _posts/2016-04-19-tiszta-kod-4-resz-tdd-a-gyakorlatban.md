---
id: 753
title: 'Tiszta kód, 4. rész – TDD a gyakorlatban'
date: '2016-04-19T12:51:56+02:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=753'
permalink: /2016/04/19/tiszta-kod-4-resz-tdd-a-gyakorlatban/
dublin_core_author:
    - 'Enter author here'
dublin_core_title:
    - 'Enter title here'
dublin_core_publisher:
    - 'Enter publisher here'
dublin_core_rights:
    - 'Enter rights here'
pyre_show_first_featured_image:
    - 'yes'
pyre_portfolio_width_100:
    - default
pyre_video:
    - ''
pyre_fimg_width:
    - ''
pyre_fimg_height:
    - ''
pyre_image_rollover_icons:
    - default
pyre_link_icon_url:
    - ''
pyre_post_links_target:
    - 'no'
pyre_related_posts:
    - default
pyre_share_box:
    - default
pyre_post_pagination:
    - default
pyre_author_info:
    - default
pyre_post_meta:
    - default
pyre_post_comments:
    - default
pyre_main_top_padding:
    - ''
pyre_main_bottom_padding:
    - ''
pyre_hundredp_padding:
    - ''
pyre_slider_position:
    - default
pyre_slider_type:
    - 'no'
pyre_slider:
    - '0'
pyre_wooslider:
    - '0'
pyre_revslider:
    - '0'
pyre_elasticslider:
    - '0'
pyre_fallback:
    - ''
pyre_avada_rev_styles:
    - default
pyre_display_header:
    - 'yes'
pyre_header_100_width:
    - default
pyre_header_bg:
    - ''
pyre_header_bg_color:
    - ''
pyre_header_bg_opacity:
    - ''
pyre_header_bg_full:
    - 'no'
pyre_header_bg_repeat:
    - repeat
pyre_displayed_menu:
    - default
pyre_display_footer:
    - default
pyre_display_copyright:
    - default
pyre_footer_100_width:
    - default
pyre_sidebar_position:
    - default
pyre_sidebar_bg_color:
    - ''
pyre_page_bg_layout:
    - default
pyre_page_bg:
    - ''
pyre_page_bg_color:
    - ''
pyre_page_bg_full:
    - 'no'
pyre_page_bg_repeat:
    - repeat
pyre_wide_page_bg:
    - ''
pyre_wide_page_bg_color:
    - ''
pyre_wide_page_bg_full:
    - 'no'
pyre_wide_page_bg_repeat:
    - repeat
pyre_page_title:
    - default
pyre_page_title_text:
    - default
pyre_page_title_text_alignment:
    - default
pyre_page_title_100_width:
    - default
pyre_page_title_custom_text:
    - ''
pyre_page_title_text_size:
    - ''
pyre_page_title_custom_subheader:
    - ''
pyre_page_title_custom_subheader_text_size:
    - ''
pyre_page_title_font_color:
    - ''
pyre_page_title_height:
    - ''
pyre_page_title_mobile_height:
    - ''
pyre_page_title_bar_bg:
    - ''
pyre_page_title_bar_bg_retina:
    - ''
pyre_page_title_bar_bg_color:
    - ''
pyre_page_title_bar_borders_color:
    - ''
pyre_page_title_bar_bg_full:
    - default
pyre_page_title_bg_parallax:
    - default
pyre_page_title_breadcrumbs_search_bar:
    - default
fusion_builder_status:
    - inactive
refaktor_post_views_count:
    - '5155'
avada_post_views_count:
    - '5156'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
image: 'assets/uploads/2016/04/29122823/22838765_m.jpg'
categories:
    - Fejlesztés
tags:
    - 'clean code'
    - S.O.L.I.D.
    - 'unit testing'
---

Itt az idő, most vagy soha: írjunk webáruházat tesztvezérelten! Ebben a cikkben azt nézzük meg, hogy hogyan is működik ez a TDD kérdés a gyakorlatban.  
  
Mivel ez a cikk némileg időigényes, előre elnézést szeretnék kérni tőled, kedves olvasó, ugyanis a programkódot csak egy nyelven írtam meg: PHP-ban. Természetesen az itt közölt módszerek némi igazítással ugyanúgy alkalmazhatóak bármely C/C++ stílusú nyelvre, így bízom benne, hogy akkor is hasznos lesz, ha adott esetben nem programozol PHP-ban.

## Tervezzünk!

Szóval előttem a nyitott PHPStorm ablak, egy sor kód sincs. Hogy kezdek neki? Először is, gondolkozom egy picit. Webshopot írok, de igazából azt szeretném, hogy ha a rendszerem újrahasznosítható lenne. Éppen ezért eldöntöm, hogy **nem egy webshop alkalmazást, hanem egy webshop modult írok**.

Méghozzá olyan modult, ami **minden külső függőségtől mentes**: nem rendelkezik adatbázis kapcsolattal, nem szeretne adott helyre írni a filerendszerben. Mindössze integrációs pontokat, interfaceket biztosít arra, hogy a későbbiekben aztán össze tudjam drótozni.

Ezzel gyakorlatilag **az összes meghozandó döntést elhalasztottunk** a projekt végére: milyen adatbázis-motort használunk? Milyen template enginet? Tök mindegy. A webshopunk addigra működik, és tesztekkel rendelkezik.

Elsőre ez fura megközelítésnek tűnhet, de hányszor jártunk már úgy, hogy az ügyfél egy számára jelentéktelennek tűnő részletet (például, hogy csak MSSQL adatbázis szervere van, de mi MySQL-re írtuk a programot) csak a projekt végén mondott el, amire a fejlesztő aztán felsóhajtott:

> Ó, b\*. Most írhatjuk újra az egészet.

Ha ez a mondat már elhangzott a karriered során, akkor a programod jó eséllyel nem jól strukturált, **összedrótoztál olyan dolgokat, amiknek igazából semmi köze egymáshoz**.

Ez lenne a S.O.L.I.D. alapelvekből az S betű: az egy felelősség elve, ami Robert C. Martin szerint így szól:

> Egy modul vagy osztály egy, és legfeljebb egy, **okkal** rendelkezzen, amiért változtatni kell.

Azaz, ha egy modulodon potenciálisan egynél több irányból érkezik, vagy érkezhet, módosítási kérés, akkor ezt az elvet megsértetted. Ezen elv mentén a webshopunknak **külön réteggel kell rendelkeznie az adatok tárolására**, és annak a rétegnek csak és kizárólag azzal szabad foglalkoznia, hogy a kívánt adatbázis motorba hogyan kerül bele az adat.

A leggyakoribb vétség az egy felelősség elve ellen az, amikor az ORM rétegünk (Doctrine, Hibernate, stb) által használt objektumokat (Entity) közvetlenül beleszőjük az alkalmazás-logikánkba. Sőt, meg merném kockáztatni, hogy maga az ORM használata is felesleges lesz a fenti elv betartásával, hiszen lesz 4-5 jól meghatározott integrációs pontunk az adatbázisra, amit ki kell tölteni SQL querykkel.

## Rendezzük be a projektünket!

Hmmm... továbbra is villog előttem a kurzor az üres ablakban... lassan írni kellene valamit. Először is, berendezem a projektemet, létrehozok egy `composer.json` filet, amiben leírom a függőségeimet. Ha más nyelven programozol, ez lenne a Maven file-ot, requirements.txt-d, vagy hasonló.

```
{
  "name": "refaktor/webshop",
  "description": "Generic webshop module",
  "minimum-stability": "stable",
  "license": "MIT",
  "authors": [
    {
      "name": "Janos Pasztor",
      "email": "janos@pasztor.at"
    }
  ],
  "autoload": {
    "psr-4": {
      "Refaktor\\Webshop\\": "src/"
    }
  },
}
```

Ezek után behúzom a PHPUnitot a composer futtatásával:

```
composer require --dev phpunit/phpunit
```

És ehhez a phpunit.xml fájlomat:

```
<phpunit
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:noNamespaceSchemaLocation="http://schema.phpunit.de/5.1/phpunit.xsd"
        convertErrorsToExceptions="true"
        convertNoticesToExceptions="true"
        convertWarningsToExceptions="false"
        beStrictAboutTestsThatDoNotTestAnything="false"
        checkForUnintentionallyCoveredCode="false"
        beStrictAboutOutputDuringTests="true"
        beStrictAboutChangesToGlobalState="true"
        stopOnError="true"
        stopOnWarning="true"
        bootstrap="vendor/autoload.php"
>
    <testsuites>
        <testsuite name="all">
            <directory suffix=".php">tests</directory>
        </testsuite>
    </testsuites>
    <filter>
        <whitelist>
            <directory suffix=".php">src</directory>
        </whitelist>
    </filter>
    <logging>
        <log type="coverage-html" target="docs/coverage" />
        <log type="coverage-clover" target="docs/coverage/clover.xml" />
    </logging>
</phpunit>
```

Ezen fájlokkal felvértezve létrehozom a két könyvtáramat (`src` és `tests`) és kezdődhet is a kódolás.

## Kezdjünk kódolni!

Na most aztán tényleg kódoljunk. Megírjuk az első tesztünket, ami a kosárra vonatkozik. Ezt a `tests/CartTest.php` fájlban tesszük meg:

```
<?php

namespace Refaktor\Webshop;

/**
 * @covers Refaktor\Webshop\Cart
 */
class CartTest extends \PHPUnit_Framework_TestCase {
    /**
     * @covers Refaktor\Webshop\Cart::getItems
     */
    public function testEmptyCart() {
        //setup
        $cart = new Cart();
        //assert
        $this->assertEquals(array(), $cart->getItems());
    }
}
```

Lefuttatjuk a unit teszteket, elhasalnak. Ez fontos, ellenőriztük, hogy tényleg elhasalnak-e a unit tesztjeink. Na ezzel felvértezve, írhatunk egy Cart osztályt az `src/Cart.php`-ban:

```
<?php

namespace Refaktor\Webshop;

/**
 * This class represents the shopping cart and can contain CartItems.
 * 
 * @see CartItem
 */
class Cart {
    /**
     * Returns the items in the cart
     *
     * @return array
     */
    public function getItems() {
        return array();
    }
}
```

Ennyi? Ennyi. Ha mindent jól csináltunk, lefutnak a tesztjeink. Refaktorálni nincs mit, vissza a tesztekhez:

```
/**
 * @covers  Refaktor\Webshop\Cart::addItem
 * @covers  Refaktor\Webshop\Cart::getItems
 *
 * @depends testEmptyCart
 */
public function testOneElementInCart() {
    //setup
    $item = new CartItem();
    $cart = new Cart();
    //act
    $cart->addItem($item);
    //assert
    $this->assertEquals(array($item), $cart->getItems());
}
```

Fail! Na, hozzuk létre az üres `CartItem` osztályt, és a Cartban az `addItem()` függvényt, valamint írjuk át a `getItems()` függvényt.

```
class Cart {
    /**
     * @var CartItem[]
     */
    private $items = array();

    /**
     * Add one item to the shopping cart.
     *
     * @param CartItem $item
     *
     * @return $this
     */
    public function addItem(CartItem $item) {
        $this->items[] = $item;

        return $this;
    }

    /**
     * Returns the elements in the cart.
     *
     * @return CartItem[]
     */
    public function getItems() {
        return $this->items;
    }
}
```

Miután itt több dolgunk egyelőre nincs, fordítsuk a figyelmünket a `CartItem` osztály felé. Hozzuk létre a `CartItemTest` osztályt. A terv az, hogy létrehozunk egy függvényt, amibe beleírhatjuk a megvásárlandó elem leltári számát, vagy az adatbázisban elfoglalt ID-jét. Ez hasznos lesz akkor, amikor majd az adatbázisba mentünk. Magának a `CartItem`nek nincs feltétlenül szüksége erre, hiszen a `CartItem`ben levő adatokból meg tudja oldani a szükséges műveleteket.

```
/**
 * @covers Refaktor\Webshop\CartItem
 */
class CartItemTest extends \PHPUnit_Framework_TestCase {
    /**
     * @covers Refaktor\Webshop\CartItem::setInventoryId
     * @covers Refaktor\Webshop\CartItem::getInventoryId
     */
    public function testSetGetInventoryId() {
        //setup
        $item = new CartItem();
        //act
        $item->setInventoryId(1);
        //assert
        $this->assertEquals(1, $item->getInventoryId());
    }
}
```

Természetesen elhasal, ahogy az illik, szóval csináljuk meg a description setter/gettert a `CartItem`ben:

```
/**
 * @var string
 */
private $inventoryId;

/**
 * Returns the inventory ID of the item put in the cart.
 *
 * @return string
 */
public function getInventoryId() {
    return $this->inventoryId;
}

/**
 * Sets the inventory ID of the item put in the cart.
 *
 * @param string $inventoryId
 *
 * @return $this
 */
public function setInventoryId($inventoryId) {
    $this->inventoryId = $inventoryId;

    return $this;
}
```

Hasonlóképpen járunk el az egységárral (`set/getUnitPrice`) és a darabszámmal (`set/getUnitCount`) is, ezzel megalapozva a végösszeg kiszámító függvény (`getTotal`) írását. Először természetesen létrehozunk egy tesztet:

```
/**
 * @covers Refaktor\Webshop\CartItem::getTotal
 */
public function testTotal() {
    //setup
    $item = new CartItem();
    //act
    $item->setUnitPrice(100);
    $item->setUnitCount(2);
    //assert
    $this->assertEquals(200, $item->getTotal());
}
```

Ezek után visszatérünk a `Cart` osztályhoz és oda is legyártjuk a `getTotal()` függvényt, ami kiszámolja a kosár teljes végösszegét.

## Miért is csináljuk az egészet?

Ha idáig eljutottál, valószínűleg felmerült benned a kérdés, hogy „Most tényleg? Ennyire triviális függvényeket tesztelünk?” De képzeljük el azt, hogy valamikor a projekt további folyamán az ügyfél azzal jön, hogy igazából ő még szeretne különböző kupon kódokat is a rendszerbe, amik valami elcsettintett logika mentén működnek.

Ahelyett, hogy frászt kapunk, kényelmesen hátradőlhetünk, hiszen a módosítás során biztosan nem fogunk tönkretenni semmit.

Először is, mivel a kupon kódok eléggé változatosak lehetnek, megállapodunk abban, hogy mit is tudjon egy kupon kód. Ezt egy interface formájában dokumentáljuk:

```
/**
 * This interface describes the functionality coupons must be able to provide.
 */
interface CouponInterface {
    /**
     * Calculate the new total after applying the coupon to the cart.
     * 
     * @param int $originalTotal
     * @param Cart $cart
     *
     * @return int
     */
    public function modifyTotal($originalTotal, Cart $cart);
}
```

Tehát minden kupon kódnak rendelkeznie kell egy olyan függvénnyel, ami fogadja a végösszeget, és a módosított végösszeget visszaadja. Ezen felül megkapja a teljes kosarat is arra az esetre, hogy ezt figyelembe kell vennie az összeg módosításakor.

Erre az interfacere írunk egy un. mock osztályt, ami egy egyszerű implementációt tartalmaz a teszteléshez. Ezt a `tests` mappába tesszük, és be fogjuk húzni a megfelelő tesztekhez:

```
/**
 * Simple coupon that deducts 50 from the total.
 */
class SimpleCouponMock implements CouponInterface {

    /**
     * Calculate the new total after applying the coupon to the cart.
     *
     * @param int  $originalTotal
     * @param Cart $cart
     *
     * @return int
     */
    public function modifyTotal($originalTotal, Cart $cart) {
        return $originalTotal - 50;
    }
}
```

Ezzel felvértezve már ki tudjuk egészíteni a `CartTest` osztályunkat:

```
/**
 * @covers Refaktor\Webshop\CartItem::getTotal
 */
public function testTotalWithCoupon() {
    //setup
    require_once(__DIR__ . '/SimpleCouponMock.php');
    $cart = new Cart();
    $item = new CartItem();
    $coupon = new SimpleCouponMock();
    //act
    $item->setUnitPrice(100);
    $item->setUnitCount(2);
    $cart->addItem($item);
    $cart->addCoupon($coupon);
    //assert
    $this->assertEquals(150, $cart->getTotal());
}
```

Ez persze, szokás szerint, el fog hasalni, hiszen még nincs meg az implementáció. Éppen ezért hozzá adjuk a következő kódrészt a Cart osztályunkhoz:

```
/**
 * @var CouponInterface[]
 */
private $coupons = array();

/**
 * @param CouponInterface $coupon
 *
 * @return $this
 */
public function addCoupon(CouponInterface $coupon) {
    $this->coupons[] = $coupon;

    return $this;
}
```

Emellett még módosítjuk a getTotal() függvényt is:

```
/**
 * @return int
 */
public function getTotal() {
    $total = 0;
    foreach ($this->getItems() as $item) {
        $total += $item->getTotal();
    }
    <ins>foreach ($this->coupons as $coupon) {
        $total = $coupon->modifyTotal($total, $this);
    }</ins>
    return $total;
}
```

És ezzel már neki is állhatunk mindenféle őrült kuponkódot implementálni, természetesen TDD-vel.

## Integráció

Felmerül a kérdés, hogy jó, jó, de hogy a búbánatba integráljuk ezt a meglevő rendszerünkbe? Hiszen egészen eddig csak elméletben szórakoztunk a mindenféle kosarakkal, hogy lesz ebből megrendelés?

Miután a kosár jobbára csak a munkamenetben létezik, hozzunk létre egy rendelés osztályt `Order` néven, amibe elmentjük a kosarunkat. A TDD-s megvalósítást rád bízom, kedves olvasó, nem lesz túl nehéz:

```
class Order {
    public function setCart(Cart $cart) {
        //...
    }
}
```

Na, hogy ezt a megrendelést el is tudjuk menteni, készítünk egy tároló interfacet:

```
interface OrderStorageInterface {
    public function store(Order $order);
    /**
     * @return Order
     */
    public function retrieve($orderId);
}
```

Erre az interfacere most már teljes nyugalommal implementálhatsz például egy `MySQLOrderStorage` osztályt, ami MySQLbe menti el a megrendelést. Ha használsz valamilyen [Dependency Injection Containert](https://www.refaktor.hu/tiszta-kod-7-resz-mi-a-fene-az-a-dependency-injection-container/) a rendszeredben, ezt a storage-ot oda is beteheted, és akkor szolgáltatásként férsz hozzá.

## Zárszó

Mint látható, ez egy igen egyszerűsített példája egy webáruháznak. A `CartItem` például semmilyen módon nem ellenőrzi, de nem is követeli meg, az `inventoryId` meglétét. A tesztekben megfogalmazott feladatok szempontjából ez lényegtelen. Amikor viszont az integrációt írjuk, vagy adatbázisba mentünk akkor ott igenis lényeges lehet, éppen ezért előnyös lehet további teszteket írni amikor azokat a részeket fejlesztjük.

Elsőre a folyamat macerásnak tűnhet, de felhívnám a figyelmedet egy „régi”, íratlan szabályra: **válaszd le az I/O csatornáidat a programod magjáról**. Magyarán az adatbázisodnak, vagy a webszervertől érkező kérések kiszolgálására írt kódnak semmi keresni valója a programlogikában.