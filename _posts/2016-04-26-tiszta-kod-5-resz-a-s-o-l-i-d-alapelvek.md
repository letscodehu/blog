---
id: 783
title: 'Tiszta kód, 5. rész – A S.O.L.I.D. alapelvek'
date: '2016-04-26T06:35:45+02:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=783'
permalink: /2016/04/26/tiszta-kod-5-resz-a-s-o-l-i-d-alapelvek/
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
    - '25689'
avada_post_views_count:
    - '25707'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
image: 'assets/uploads/2016/04/29122834/46165954_m.jpg'
categories:
    - Fejlesztés
tags:
    - 'clean code'
    - S.O.L.I.D.
---

Ma a programozás terén szinte mindenki hallott már a Model-View-Controller kódszervezési elvről. Annak ellenére, hogy ez rengeteget segített abban, hogy a kód karbantarthatóbb legyen, a hosszú távú kód tisztaság továbbra is probléma. Éppen ezért ebben a cikkünkben a S.O.L.I.D. alapelveket mutatjuk be.

A S.O.L.I.D. alapelvek szülőatyja [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_Cecil_Martin), aki nem csak a clean code mozgalom vezérszónoka, hanem többek között az [Agile Manifesto](http://agilemanifesto.org/) egyik eredeti megfogalmazója is.

Az elvek a következőképpen szólnak. (Ha nem érted, ne aggódj, elsőre én sem. Mindjárt magyarázok.)

<div class="fusion-table table-1 hidden-sm">|  | <th>Single Responsibility Principle</th> |  | <th>Egy felelősség elve</th> |  | Egy osztály vagy modul egy, és csak egy felelősséggel rendelkezzen (azaz: egy oka legyen a változásra). |  |
|---|------------------------------------------|---|--------------------------------|---|---------------------------------------------------------------------------------------------------------------|---|
|  | <th>Open/Closed Principle</th> |  | <th>Nyílt/zárt elv</th> |  | Egy osztály vagy modul, legyen nyílt a kiterjesztésre, de zárt a módosításra. |  |
|  | <th>Liskov substitution principle</th> |  | <th>Liskov helyettesítési elv</th> |  | Minden osztály legyen helyettesíthető a leszármazott osztályával anélkül, hogy a program helyes működése megváltozna. |  |
|  | <th>Interface segregation principle</th> |  | <th>Interface elválasztási elv</th> |  | Több specifikus interface jobb, mint egy általános. |  |
|  | <th>Dependency inversion principle</th> |  | <th>Függőség megfordítási elv</th> |  | A kódod függjön absztrakcióktól, ne konkrét implementációktól. |  |

</div><div class="hidden-md"><dl><dt>Single Responsibility Principle (Egy felelősség elve)</dt><dd>Egy osztály vagy modul egy, és csak egy felelősséggel rendelkezzen (azaz: egy oka legyen a változásra).</dd><dt>Open/Closed Principle (Nyílt/zárt elv)</dt><dd>Egy osztály, vagy modul, legyen nyílt a kiterjesztésre, de zárt a módosításra.</dd><dt>Liskov substitution principle (Liskov helyettesítési elv)</dt><dd>Minden osztály legyen helyettesíthető a leszármazott osztályával anélkül, hogy a program helyes működése megváltozna.</dd><dt>Interface segregation principle (Interface elválasztási elv)</dt><dd>Több specifikus interface jobb, mint egy általános.</dd><dt>Dependency inversion principle (Függőség megfordítási elv)</dt><dd>A kódod függjön absztrakcióktól, ne konkrét implementációktól.</dd></dl></div>Na ez eddig olyan, mintha egy matek tételt olvasnánk. Akkor se értettük, most sem értjük, megjegyezni meg senki nem fogja. Helyette inkább nézzünk konkrét példákat.

## Egy felelősség elve

> Egy osztály, vagy modul, egy, és csak egy felelősséggel rendelkezzen (azaz: egy oka legyen a változásra).

Az, hogy egy modulnak egy felelőssége legyen, tök jó hangzatos szlogen, de hogy a pékbe valósítjuk ezt meg? Egyáltalán mi az a felelősség a programozás szempontjából?

Nézzünk egy példát. Legyen adott egy iskolai/egyetemi nyilvántartó rendszer, aminek van egy Excel exportja. A delikvens megnyomja a gombot, és ebből kijön egy Excel file a diákok listájával. Egy szép napon odajön hozzánk az iskola/egyetem igazgatója, hogy *változtassuk meg az oszlopok sorrendjét*.

Meg is tesszük, és nagyjából 2 órával a módosítás élesítése után jön egy olyan levél a pénzügyi igazgatótól, amit nem teszünk ki a kirakatba: kiderül, hogy az adatok további feldolgozására Excel makrókat használt, és az oszlop sorrend változással eltörtek a cellahivatkozások.

Ismerősen hangzik? Mi is történt itt? Ha jobban megnézzük, az Excel export funkciónak két felelőssége volt. Két potenciális forrás módosítási kérésekre: az igazgató, és a pénzügyi igazgató. Ennek a két felelősségnek nem szabadott volna egy funkcióban egyesülnie.

De nézzünk egy másik példát ugyan ebben a rendszerben. Adott egy `Student` osztály a következő függvényekkel:

```
class Student {
    public void addGrade(Subject subject, int grade) { }
    public void setName(string name) { }
}
```

Ez elsőre nem is tűnik olyan elvetemültnek, azonban ha jobban megnézzük, a jegy beírást a tanár végzi, amíg a név változtatást az iskola titkárság vagy tanulmányi osztály. Magyarán egy osztályban folyik össze két felelősség. Egy osztályt kell adott esetben módosítani két külön helyről érkező kérések alapján.

Itt hatalmas a veszély, hogy az egyik helyről érkező kéréssel elrontjuk a másik működését, hiszen osztályon belül sokszor nyúlunk közös adathoz. Arról nem is beszélve, hogy a fenti leírás alapján a Student osztály még az adatbázishoz is hozzányúl, ezért ott további felelősségek halmozódnak.

Szervezzük át tehát a Student osztályt úgy, hogy önmagában csak egy adattároló legyen, és a különböző feladatoknak külön osztályai legyenek:

```
class Student {
}
class GradeBook {
    public void addGrade(Student student, int grade) { }
}
class StudentRecords {
    public void changeStudentName(Student student, string newName) { }
}
```

Ezekből levonva a következtetést, a felelősség lehet **például**:

- Egy felhasználó vagy felhasználói csoport
- Egy külső szolgáltatás (pl. adatbázis, API, fileba írás stb)
- A felhasználói felület vagy azok elemei
- ... és még sok minden más.

> **Tudtad?** Az ORM vagy ActiveRecord pattern megsérti ezt az elvet. Ugyan segít gyorsan összerakni a kívánt alkalmazást, később azonban feltétlenül érdemes megfontolni a lecserélését. (Itt nagy a veszély, hogy ez soha nem történik meg.)

## Nyílt/zárt elv

> Egy osztály, vagy modul, legyen nyílt a kiterjesztésre, de zárt a módosításra.

Az előző példánál maradva, nézzük az alábbi példát:

```
abstract class Employee {
    const TYPE_TEACHER = 0;
    const TYPE_CLEANER = 1;
    public void setType(int type) { }
    public int getType() { }
}

class Teacher extends Employee {
    public Teacher() {
        setType(TYPE_TEACHER);
    }
}

class Cleaner extends Employee {
    public Cleaner() {
        setType(TYPE_CLEANER);
    }
}
```

Miért nem jó ez? Fogalmazzuk meg a kérdést: hogyan adnánk hozzá egy új alkalmazott típust? Leginkább sehogy, ahhoz, hogy egy új alkalmazott osztályt hozzá tudjunk adni, kénytelenek vagyunk hozzányúlni a meglevő kódhoz.

Mit kellene helyette csinálni? A jelen példában nemes egyszerűséggel ki kell venni a tipus ID-kat, és ahol igény van megkülönböztetésre, ott magát az objektum típusát kell ellenőrizni. Általánosságban szólva, azt vizsgáljuk meg, hogy vajon **az osztályunk kiterjeszthető-e egy leszármaztatott osztállyal, anélkül, hogy az eredeti osztályon módosítani kellene?**

Lehetne például így:

```
interface Employee {
}

class Teacher implements Employee {
}

class Cleaner implements Employee {
}
```

Azaz van egy Employee interface, ami leírja a szükséges közös működést, az implementációt azonban rábízzuk az interfacet használó osztályokra. Azoknak a függvények, amik Employee típust várnak, teljesen fölösleges arról tudniuk, hogy létezik Teacher vagy Cleaner osztály is, hiszen ők csak a közös működést használják.

> **Tipp:** ha működést írsz le, használj interface-t! Ettől függetlenül készíthetsz absztrakt osztályt is, de hagyd meg a lehetőségét, hogy valaki a Te implementációdtól függetlenül valósítsa meg a kívánt működést! (Az olyan nyelvekben, mint a C++, nincsenek interfacek. Helyettük érdemes csak absztrakt függvényekkel rendelkező absztrakt osztályokat használni.)

## Liskov helyettesítési elv

> Minden osztály legyen helyettesíthető a leszármazott osztályával anélkül, hogy a program helyes működése megváltozna.

Nézzünk egy példát a web világából, konkrétan egy blogmotort.

```
class BlogPost {
    public void setContent(string content) { }
    public string getContent() { }
}
class VideoBlogPost extends BlogPost {
}
```

Ez eddig szép és jó, de mi történik akkor, ha a `VideoBlogPost` osztály `getContent` függvényét erre változtatjuk:

```
class VideoBlogPost extends BlogPost {
    public string getContent() {
        return "<iframe src=\"https://www.youtube.com/embed/" + videoId + "\"></iframe>"
    }
}
```

Teljesen jó megoldás lenne, ha nem kellene figyelembe vennünk a BlogPostból származó kötöttségeket. Nézzük ezt a példát:

```
class AdvertisementPlugin {
    public void processBlogPost(BlogPost post) {
        post.setContent(post.getContent() + "<script ...></script>";
    }
}
```

Mint látható, ez a plugin módosítja a blogpost tartalmát. Ezt teheti például közvetlenül azelőtt, hogy a HTML templatek értelmeződnek. A VideoBlogPost esetén ez viszont nem működne, hiszen ott a setContent függvény semmilyen hatással nem bír. **Magyarán a VideoBlogPost megsérti ezt az elvet.**

Hogyan lehetne ezt helyre hozni? Mi sem egyszerűbb:

```
class VideoBlogPost extends BlogPost {
    public string VideoBlogPost(string videoId) {
        setContent("<iframe src=\"https://www.youtube.com/embed/" + videoId + "\"></iframe>");
    }
}
```

Mint látható, a konstruktorból írtuk bele a tartalmat, így a BlogPosttól elvárt működés megmarad.

## Interface elválasztási elv

> Több specifikus interface jobb, mint egy általános.

Ez az elv viszonylag egyszerű. Ne csinálj egy gigantikus interfacet, ami mindenre jó, helyette inkább sok kisebb, célra szabott interfacet. Gondoljunk csak bele, egy interface egy működést ír le, és arra mások megvalósításokat írnak. Ha egy interface 50 kötelező függvénnyel rendelkezik, mi az esélye annak, hogy ezt helyesen fogja implementálni valaki? Esetleg arra, hogy van benne egy függvény, amiben semmi más nincs, csak egy kivétel eldobása, mondván hogy *not implemented*.

Klasszikus példa erre az, ha olyan programot írunk, ami nyomtatókat kezel. A manapság kapható nyomtatóra a következő interface illene:

```
interface PrinterInterface {
    public void print(Document document);
    public Document scan();
}
```

Ez tök jó, hiszen minden egyben van. Tud nyomtatni, és tud scannelni. De mi történik akkor, ha az ősrégi nyomtatóm megvalósítását írom? Ez fog történni:

```
class MyReallyOldPrinter implements PrinterInterface {
    public void print(Document document) {
        //print document here
    }
    public Document scan() {
        throw new NotImplementedException();
    }
}
```

Célravezető? Hát kevésbé, mindenféle fura hibákat okozhat, ha látszólag megmagyarázhatatlan hibaüzenetek jelennek meg a felhasználónak. Helyette érdemesebb szétválasztani a két interfacet:

```
interface PrinterInterface {
    public void print(Document document);
}
interface ScannerInterface {
    public Document scan();
}
```

Természetesen túlzásba is lehet vinni, de ha látható, hogy nem minden esetben lehet minden függvényt implementálni, válasszuk szét az interfaceinket.

## Függőség megfordítási elv

> A kódod függjön absztrakcióktól, ne konkrét implementációktól.

Na, még egy ilyen hangzatos szlogen. Ki vagyunk vele segítve. Nézzünk megint egy példát.

Klasszikusan, ha programot írunk, egyik függvény hívja a másikat. Tehát például a controller függvénye hívja az üzleti logika függvényeit, az üzleti logika függvénye pedig hívja az adatbázis függvényeket.

```
class MyController {
    public void myAction() {
        BusinessLogic myBusinessLogic = new BusinessLogic();
        Data myData = myBusinessLogic.getSomeData();
        //...
    }
}

class BusinessLogic {
    public Data getSomeData() {
        DatabaseConnection db = new DatabaseConnection();
        DatabaseQueryResult result = db.query('SELECT ...');
        //...
    }
}

```

Első olvasatra ez teljesen szép és átlátható. Ha valahol hiba van, nagyon kevés helyet kell végig néznünk. Azonban mi történik akkor, ha valamelyik elemét tesztelni akarjuk? Le tudjuk választani az alatta levő rétegeket és tudjuk őket helyettesíteni? Vagy még extrémebb eset: az alatta levő réteg [gyártóját beperelik és eltávolítja a csomagot](http://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/?mt=1458733182820), amire építkeztünk? Le tudjuk könnyen cserélni egy másikra?

Jó eséllyel nem. Éppen ezért ez az elv arra szólít fel, hogy alkossunk absztrakciókat, vagy ha úgy tetszik, **interfaceket a rétegek közé**. A fenti programot átírva, nézhetne ki így:

```
class MyController {
    private BusinessLogicInterface businessLogic;

    <ins>public MyController(BusinessLogicInterface businessLogic) {</ins>
        this.businessLogic = businessLogic;
    }

    public void myAction() {
        Data myData = businessLogic.getSomeData();
        //...
    }
}

class BusinessLogic {
    private DatabaseConnectionInterface databaseConnection;

    <ins>public BusinessLogic(DatabaseConnectionInterface databaseConnection) {</ins>
        this.databaseConnection = databaseConnection;
    }

    public Data getSomeData() {
        DatabaseQueryResult result = databaseConnection.query('SELECT ...');
        //...
    }
}

```

Az összes osztályunk **kizárólag absztrakcióktól függ** (interfacek), és ráadásul **cserélhető** is, mert az osztály nem saját maga hozza létre azok példányait, hanem a konstruktorban elvárja paraméterként az adott típusú objektumot.

Ezen a ponton jogosan küldenél el a fenébe, hiszen ez hatalmas macera, de szerencsére erre is van megoldás. A különböző [Dependency Injection Container megoldások](https://www.refaktor.hu/tiszta-kod-7-resz-mi-a-fene-az-a-dependency-injection-container/) képesek észlelni az egyes modulok igényeit, és a konfiguráció alapján képesek automatikusan létrehozni ezeket.

## Zárszó

A S.O.L.I.D. elvek nem eredményezik automatikusan azt, hogy a kód mindörökké karbantartható lesz. Ahhoz emberi erőt is kell beletenni.

Egy módosítási kérésnél meg kell állni, hogy gyorsan összedrótozzuk működőre. Ha már ott az összedrótozás, venni kell a fáradtságot, és szét kell szedni.

Ha olyan ügyfél kérés jön, amire nem számítottunk, és hirtelen szét kell szednünk valamit, ami eddig együtt volt, nem ússzuk meg a refaktorálást. Ebben azonban rengeteget segít, ha a korábbi cikkekben bemutatott tesztelést, tesztvezérelt fejlesztést használjuk.