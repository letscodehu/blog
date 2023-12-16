---
id: 2001
title: 'Az objektum-orientált programozás alapjai'
date: '2016-10-30T20:51:25+01:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=1891'
permalink: /2016/10/30/az-objektum-orientalt-programozas-alapjai/
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
    - '7436'
avada_post_views_count:
    - '7436'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:0:"";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
categories:
    - Alapozó
---

Korábban már beszéltünk a haladó objektum-orientált programozás kérdéseiről, de azt hiszem, nem árt visszatérni az alapokhoz. Ma az objektum-orientált programozást vesézzük ki, egészen az alapoktól kezdve.  
  
Nézzünk mindjárt egy kis kódot:

```
class Student {
    string name;
}
```

Ez egy *osztály*. Ha ezt az osztályt szeretnénk használni, azt példányosítással tehetjük meg. Nagyjából így:

```
Student student = new Student();
student.name    = "János";
```

Vagyis az osztályt úgy képzelhetjük el, mint egy tervrajz. A tervrajz alapján csinálunk egy konkrét példányt.

Vagyis a tervrajzot, az osztályt használva, létrehozhatunk több példányt is:

```
Student mintaJozsef = new Student();
mintaJozsef.name    = "Minta József";

Student mintaBela   = new Student();
mintaBela.name      = "Minta Béla";
```

Amikor létrehozzuk az osztály példányt, a futtató környezet lefoglalja az adott osztályhoz szükséges memóriát. Ha létrehozunk egy második példányt, az a második példány egy másik memóriaterületet kap. Vagyis minden példánynak saját memóriaterülete van.

Bonyolítsuk kicsit tovább, tegyünk be egy függvényt:

```
class Student {
    string name;

    <ins>void setName(string name) {
        this.name = name;
    }</ins>
}
```

Már sejtheted, hogy mi az a `this`. Ez egy olyan nyelvi konstrukció, ami az aktuális példányra mutat. Vagyis ha alacsonyabb szinten nézzük, `this`-el hivatkozhatunk az aktuális példány memóriaterületére.

Vagyis egy osztályban két dolog lehet: változók és függvények. Összekötjük az adatokat a hozzájuk kapcsolódó funkcionalitással és együtt kezeljük őket.

Egy dologgal viszont még küzdünk. Nem tudjuk kikényszeríteni, hogy az osztály változóit kötelező legyen megadni. Szerencsére erre is van megoldás, a **konstruktor**. Ez egy olyan speciális függvény, ami az osztály példányosításánál fut le. A neve programnyelvenként változó, de sokszor az osztály nevével egyezik meg. Lássuk:

```
class Student {
    string name;

    <ins>Student(string name) {
        this.name = name;
    }</ins>
}

Student student = new Student("János");
```

Ó minő egyszerűség! Kikényszeríthetjük a kezdő paramétereket!

## Mi legyen egy osztályban?

Ha előtte csak procedurálisan, függvényekkel programoztunk, az objektum-orientált programozás nagy változást hoz. A függvényeink nem állnak magukban, hanem adatokkal kapcsoljuk össze őket.

Így hát kezdő OOP-sként egy Facebookkal foglalkozó alkalmazásban valami ilyesmit írnánk:

```
class FacebookClient {
  public FacebookPerson[] getFriendsList(string facebookAuthToken) { ... }
  public void sendMessage(string facebookAuthToken, FacebookPerson target, string message) { ... }
}
```

Vagyis az osztályunkat úgy kezeljük mint egy függvénytárolót. Ezzel azonban pont az OOP előnyeit dobjuk el. Sokkal egyszerűbb, ha a Facebook kliensünk paraméterezését elvégezzük a konstruktorban:

```
class FacebookClient {
  <ins>private string authToken;

  public FacebookClient(string facebookAuthToken) {
    this.authToken = facebookAuthToken;
  }</ins>

  public FacebookPerson[] getFriendsList() { ... }
  public void sendMessage(FacebookPerson target, string message) { ... }
}
```

Ennek több előnye is van. A legfontosabb, hogy a Facebook auth tokenjét nem kell minden egyes függvényhez átadnunk, elegendő egyetlen egyszer felkonfigurálni, utána már az osztály függvényei használhatják.

Talán ennél is lényegesebb kérdés, hogy mi mindent csomagoljunk egy osztályba. Itt nem megyünk bele az objektum-orientált tervezés bonyodalmaiba, ezzel kapcsolatban érdemes a [S.O.L.I.D.-ról szóló cikkünket](https://www.refaktor.hu/tiszta-kod-5-resz-a-s-o-l-i-d-alapelvek/) elolvasni.

Röviden és tömören úgy érdemes megválasztani egy osztály funkcionalitását, hogy csak és kizárólag egy ok lehessen arra, hogy megváltoztassuk. A példa kedvéért csináljunk egy osztályt, ami egy kimutatást generál Excel fájlban. Ezt a kimutatást a pénzügyes és az igazgató kapja. Ha most az igazgató azzal a kéréssel jön, hogy töröljünk ki egy oszlopot a kimutatásból, bajban vagyunk, ha a pénzügyes ezt az oszlopot szeretné használni. Vagyis a kimutatás gyártó osztályunknak két feladata van, holott csak egynek szabadna lennie. Éppen ezért a kimutatás-gyártó osztályunkat ketté kell választani.

## Láthatóság

Egy dolog kicsit belerondíthat a képbe. Mint fentebb látható, az osztály változóihoz közvetlenül is hozzá tudunk nyúlni, megkerülhetjük a szabályokat kikényszerítő függvények használatát. Vagyis hiába írunk ilyen kódot:

```
class Student {
    string name;

    void setName(string name) {
        <ins>if (name != "") {
            //Error!
        }</ins>
        this.name = name;
    }
}
```

Egyszerűen megkerülhető:

```
Student student = new Student();
student.name    = "";
```

Akadályozzuk hát meg. Tegyük priváttá a változókat:

```
class Student {
    <ins>private</ins> string name;

    void setName(string name) {
        if (name != "") {
            //Error!
        }
        this.name = name;
    }
}
```

Láthatóságot változókra és függvényekre is alkalmazhatunk. Összesen három különböző fajtát különböztetünk meg.

- **public:** Bárki írhat az adott változóba, vagy ha függvény, azt bárki meghívhatja.
- **protected:** A változóba írás, vagy az adott függvény meghívása csak az adott osztályból, és az örökölt osztályokból lehetséges. (Erről mindjárt beszélünk.)
- **private:** Csak és kizárólag az adott osztályból írható az adott változó, vagy hívható meg az adott függvény.

> **Tanács**  
> A változóid, függvényeid legyenek annyira privátak, amennyire csak lehet!

## Osztályok együttműködése

Ha objektum-orientáltan programozol, az osztályaidnak együtt kell működnie valahogy. Vegyünk egy példát. Adott egy webáruház, ahol az ügyfél elmentheti a kártya adatait az ismételt vásárlásokhoz. Hogy megfeleljünk a biztonsági szabályoknak ezt a tárolást, és a kártyák terhelését, külső szolgáltató végzi. Legyen ez a szolgáltató a Spreedly. Nem azért, mert fizetnek nekünk (sajnos), hanem mert tényleg jó a szolgáltatásuk.

Na most, lesz egy olyan osztályunk, ami a megrendeléseket kezeli. Naívan azt gondolhatnánk, hogy ez lesz a jó megoldás:

```
class SpreedlyConnector {
  /**
   * This function will charge a given customer with the amount specified
   * as a parameter and return a response.
   */
  public ChargeResponse chargeCustomer(Customer customer, MonetaryAmount amount) {...}
}

class WebshopLogic {
  public void order(Cart cart) {
    SpreedlyConncetor payment = new SpreedlyConnector();
    payment.chargeCustomer(cart.getCustomer(), cart.getAmount());
  }
}
```

Vagyis a `SpreedlyConnector` osztály foglalkozik azzal, hogy terhelje az ügyfél kártyáját, a WebshopLogic pedig a megrendelés hatására meghívja ezt a funkciót.

A fentiekkel azonban van egy igen komoly probléma. A `WebshopLogic` példányosítja a `SpreedlyConnector` osztályt. Azaz ha a `SpreedlyConnector` osztálynak szüksége van különböző paraméterekre, például jelszóra, API kulcsra, vagy hasonlóra, akkor a `WebshopLogic` osztálynak erről tudnia kell, hogy példányosíthassa. Talán ezen a ponton mondanom sem kell, de a `WebshopLogic` feladatkörébe ez egyértelműen nem tartozik bele.

Éppen ezért egy olyan módszert választunk, amivel ez megkerülhető. A `WebshopLogic` osztályt átírjuk úgy, hogy a konstruktorban kérje be paraméternek a `SpreedlyConnector`t.

```
class WebshopLogic {
  <ins>private SpreedlyConnector payment;
  public WebshopLogic(SpreedlyConnector payment) {
    this.payment = payment;
  }</ins>

  public void order(Cart cart) {
    <ins>this.</ins>payment.chargeCustomer(cart.getCustomer(), cart.getAmount());
  }
}
```

Ezt hívják dependency injectionnek. Vagyis kívülről adjuk át az osztály függőségeit. [Erről bővebben a tiszta kód sorozatunkban írtunk.](https://www.refaktor.hu/tiszta-kod-7-resz-mi-a-fene-az-a-dependency-injection-container/)

Egy gond azonban még mindig van. Mi történik akkor, ha a Spreedly helyett egy másik fizetési szolgáltatót kell bekötnünk? (Azt hiszed ez soha nem történik meg? Csak az elmúlt 2-3 évben több mint fél tucatszor kellett ezt a műveletet végrehajtanom.)

Szóval a gond az, hogy a `WebshopLogic` közvetlenül függ a `SpreedlyConnector` osztálytól. Jobb lenne, ha a fizetési szolgáltató cserélhető lenne, nem?

Mint kitűnik, erre van egy igen egyszerű megoldás. Megalkotunk egy általános előírást, hogy egy adott fizetési szolgáltatónak hogyan kell kinéznie. Ezt nevezzük `interface`-nek, vagyis programfelületnek.

```
interface PaymentProvider {
  /**
   * This function will charge a given customer with the amount specified
   * as a parameter and return a response.
   */
  public ChargeResponse chargeCustomer(Customer customer, MonetaryAmount amount);
}

class SpreedlyConnector implements PaymentProvider {
  /**
   * This function will charge a given customer with the amount specified
   * as a parameter and return a response.
   */
  public ChargeResponse chargeCustomer(Customer customer, MonetaryAmount amount) {
    ...
  }
}

class WebshopLogic {
  private PaymentProvider payment;
  public WebshopLogic(PaymentProvider payment) {
    this.payment = payment;
  }

  public void order(Cart cart) {
    <ins>this.</ins>payment.chargeCustomer(cart.getCustomer(), cart.getAmount());
  }
}
```

Láthatod, hogy a WebshopLogic most már nem függ a Spreedly megvalósítástól, hanem egy felületi előírástól, egy API-tól. A Spreedly megvalósítást cserélhetjük bármilyen tetszőleges másik szolgáltatásra, csak a megadott interface-t kell implementálni a fent bemutatott módon.

Éppen ezért hívják az interfacet más néven szerződésnek, vagy angolul contract-nak. Szerződés arról, hogy milyen működést biztosít az egyik fél a másiknak.

Arra érdemes figyelni, hogy az interface tényleg egy általános működést írjon le. Konstruktort, vagy egy fizetési szolgáltató kedvéért írt függvényt ne tegyünk bele.

## Öröklődés

Ha már az interface fogalmával megismerkedtünk, általánosítsuk egy kicsit. Az interface szigorúan csak egy működést írt le, a megadott függvényekben nem lehetet kódot megadni, amely minden megvalósító osztályra vonatkozik.

Nos, erre való az öröklődés. A legtöbb nyelvben így, vagy ehhez hasonlóan működik:

```
class A {
  public void foo() { ... }
}

class B extends A {
}

B bar = new B();
bar.foo();
```

Vagyis a B osztály örökölte az A osztály tulajdonságait, függvényeit. És itt emlékezzünk vissza a láthatóságnál mondottakra:

- **public:** Bárki írhat az adott változóba, vagy ha függvény, azt bárki meghívhatja.
- **protected:** A változóba írás, vagy az adott függvény meghívása csak az adott osztályból, és az örökölt osztályokból lehetséges.
- **private:** Csak és kizárólag az adott osztályból írható az adott változó, vagy hívható meg az adott függvény.

Ugye így már sokkal egyszerűbb?

Az öröklődésnél arra érdemes figyelni, hogy a legtöbb tankönyvi példa hibás. Matematikai érdelemben véve ugyan a négyzet örökli a téglalap és a rombusz tulajdonságait, de ha programozásban leképezzük őket, semmiképpen ne használjuk öröklődést!

Nézzük a példát:

```
class Rectangle {
  public function setA(int a) { ... }
  public function setB(int b) { ... }
}

class Square extends Rectangle {
}
```

Gondoljunk csak bele. Ha a négyzeten beállítunk a-t, akkor a négyzet szabályai szerint b-nek is változnia kell. Vagyis megvalósíthatnánk így:

```
class Square extends Rectangle {
  private int a;
  private int b;
  public function setA(int a) {
    this.a = a;
    this.b = b;
  }
  public function setB(int b) {
    this.a = a;
    this.b = b;
  }
}
```

Igen ám, de így mind a `setA`, mind a `setB` függvény rendelkezik *mellékhatással*, nem viselkednek ugyanúgy, mint az az osztály amitől örökölnek. Egy `Rectangle`-t váró kód joggal várhatná el azt, hogy egy olyan osztályt kap, amin A és B külön állítható.

Vagyis az öröklődési struktúra nem feltétlenül a való életnek felel meg szigorúan, hanem az azonos viselkedés elvét követi. [Erről bővebben a tiszta kód sorozatunkban írtunk.](https://www.refaktor.hu/tiszta-kod-5-resz-a-s-o-l-i-d-alapelvek/) (Ha megfigyeled, a legtöbb OOP-t tanító tankönyv erre nem tér ki, vagy akár hibás példákat is tartalmaz.)

## Mi a fene az a static?

Ha mások OOP-s kódját nézegeted, láthatsz benne ilyeneket:

```
class DatabaseConnector {
  private static DatabaseConnector instance;
  public static DatabaseConnector getInstance() {
    if (!self::instance) {
      self::instance = new DatabaseConnector();
    }

    return self::instance;
  }
}
```

A cikk legelején beszéltünk arról, hogy egy objektum példányosításakor lefoglalódik a szükséges memóriaterület, és hogy minden példány memória területe különálló.

Na a `static` dolgokra ez nem igaz. A `static` ugyanis azt jelenti, hogy az adott memória terület közös az osztály összes példánya között. Ennek következtében aztán a `this` kulcsszót sem lehet használni, hiszen a `static` kód nem tud semmit a példányokról.

A fenti kód egyébként a [singleton vagy egyke tervezési mintát](https://hu.wikipedia.org/wiki/Egyke_programtervez%C3%A9si_minta) valósítja meg. Főleg kezdőként, de a későbbiekben is érdemes azonban a static használatát messzemenően elkerülni, pont a dependency injectionről szóló részben leírt problémák miatt.

## Összefoglaló

Ennyi talán elég is egy OOP gyorstalpalótól. Ha most látsz először életedben OOP-t, jó eséllyel ennek a mondatnak kifejezetten örülsz is. Arra azonban érdemes odafigyelni, hogy ez csak az OOP-s utad kezdete. Érdemes vele kisérletezni, bővítgetni a tudásodat, és ha már kellő biztonságot szereztél az OOP-s kódolásban, [folytatni a tanulást a tiszta kód cikksorozatunkkal](https://www.refaktor.hu/tiszta-kod-1-resz-teszteljek-vagy-ne-teszteljek/).