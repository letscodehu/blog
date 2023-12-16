---
id: 1392
title: 'Utószó a Tiszta kód sorozathoz'
date: '2016-07-18T07:34:56+02:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=1392'
permalink: /2016/07/18/utoszo-a-tiszta-kod-sorozathoz/
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
    - '4391'
avada_post_views_count:
    - '4392'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
image: 'assets/uploads/2016/12/09202342/3343062926_4e65c72b65_o.png'
categories:
    - Fejlesztés
tags:
    - 'clean code'
    - 'clean coding'
    - design
---

A tiszta kód sorozat vége óta rengeteg visszajelzést kaptunk tőletek, és sokan kerestetek meg a különböző projektjeitekkel véleményt kérve.

## Frameworkök, függőségek

A sorozatban többször is említettem, hogy a frameworköket, külső függőségeket érdemes leválasztani. Amiről talán nem beszéltünk részleteiben, az az, hogy hogyan is kell ezt jól megvalósítani.

Játsszunk egy gondolat játékot. Tegyük fel, hogy most, 2016-ban elkezdesz egy projektet. Tegyük fel, hogy PHP-ban írod a népszerű [Laravel frameworköt](https://laravel.com/) felhasználva. Az aktuális verzióját használva még van jó két éved az aktuális verzióval [a Laravel support policyjéből kiindulva](https://laravel.com/docs/5.1/releases#support-policy). (A Laravel itt csak példa, a legtöbb framework 3 éves support időszakkal dolgozik.) Ha frameworköt használsz, ezt nyilván azért teszed, mert szeretnéd használni a felkínált funkciókat. Ilyen lehet például a konfiguráció, routing (a HTTP kérések eljuttatása a megfelelő controllerhez), jogosultság kezelés, adatbázis kezelés, cachelés, stb.

Zöld mezős (új) projekt, feltelepíted a Laravelt, néhány külső modult és máris kezdesz kódolni. Egy-két órán belül előáll az adatbázis és a hét végére már meg is születik az alkalmazás egy prototípusa. A főnököd el van ámulva, hogy „ezt így hogy”. Néhány héten belül kész a kívánt Minimum Viable Product (MVP) és lehet kimenni élesbe. A kód szép, tiszta, Te írtad, senki más nem nyúlt hozzá.

A projekt hihetetlen siker, jön is tömegével a felhasználói visszajelzést. Nem jó úgy a jogosultság rendszer, át kell írni. Nem jó az adatbázis sem, azt is át kell alakítani. Természetesen a már befolyt felhasználói adatokat meg kell tartani és értelmes módon tovább kell használni. Telik-múlik az idő, hétről hétre jönnek az új „fícsör rikvesztek”, és ahogy az lenni szokott, idő semmire nincs. Beteszel több külső modult, gyorsan hozzá csapod a keretrendszer által kínált megoldásokat, mert *nincs idő*. A keretrendszer és a többi külső modulod szépen lassan belelóg az üzleti logikádba.

Eltelt egy év, 2017 közepén járunk és a projekt továbbra is sikeres, azóta nagy bánatodra több fejlesztő is dolgozik rajta. Egy szép reggelen elhangzik a rettegett kérdés: „Mennyi meló lenne API-t építeni hozzá?” Végig szalad a hátadon a hideg. Pontosan tudod, hogy az egész jogosultság kezelés egy katasztrófa, és a működési logika fele a controllerekben van. Biztos ami biztos, benyögöd a „három hónap” választ. A főnököd hallhatóan nyel egyet.

Ezen a ponton nagy szociális érzékenységről teszel tanúbizonyságot azzal, hogy elhallgatod azt a témát amit eredetileg fel akartál hozni. Nevezetesen azt, hogy a Laravel fő támogatási ciklusa lejárt és mostantól csak biztonsági frissítések érkeznek. Magyarán jó lenne, ha lassan beütemeznénk az 5.2-re való átállást. Pontosan tudod, hogy a teljes alkalmazás rá van gyógyulva a frameworkre és az a néhány, visszafele nem kompatibilis változás bizony-bizony hoz magával néhány ember-hónapnyi munkát.

Amikor este haza mész és leülsz a gép elé játszani (mert kódolni már öreg vagy, nincs kedved), elgondolkozol azon, hogy inkább mentél volna péknek. Hová tűnt az az ember, aki hajlandó volt éjszakákat átkódolni csak azért, hogy működjön egy új, izgalmas technológia? Azért hogy meglegyen az az érzés, hogy igen, megcsináltad?

Talán sejthetted, ez egy ismétlődő történet volt ez én karrieremben, épp úgy mint sok más fejlesztőében. A Laravelhez szintén nincs sok köze, bármelyik másik keretrendszert vagy függvény könyvtárat írhattam volna, ugyanúgy igaz lenne. Hol csúszik hiba ebbe az egészbe? Mit csinálunk rosszul?

Kérdezem én, hányszor hallottad, vagy akár mondtad, ezt a mondatod: „Szar az egész, ki kellene dobni és újra kellene írni.” Gyanítom, hogy sokszor. Ha néhány éves tapasztalattal rendelkezel és nem váltottál céget mielőtt ez bekövetkezett, ezt a mondatot a saját kódodra, projektedre is mondtad vagy hallottad.

Mi a különbség az új és a régi kód között? Az új kód egy remekmű, egy szobor, egy mester alkotása. Szép, tiszta, csak azt csinálja, amit kell. A régi kód ezzel szemben általában egy hatalmas katyvasz, keresztbe-kasul függőségek, régi kód darabok és teszteletlen részek. Nade a régi kód is valamikor új kód volt! Hogyan lett a remekműből egy undorító gőzölgő halom?

A válasz az, hogy belefolyt egy csomó tudás, üzleti felismerés. Másra van igény, át kell alakítani. Mégis, ez a fajta hozzáadott érték valahogy hozzájárul a kódminőség romlásához.

A gond ott van, hogy **úgy tekintünk az alkalmazásunkra mint egy egyszer legyártandó remekműre**. Egyszer összerakjuk és soha többet nem akarunk hozzányúlni. Az igény viszont az, hogy **készüljünk fel a változásra**. A programunk nem egy fix, egyszer legyártandó termék, hanem egy élő, változó dolog, *soft*ware. Magyarán kezdetektől fogva fel kell készülnünk arra, hogy bármikor bármi változhat.

Ez azzal jár, hogy a programunkban kénytelenek vagyunk kicsi, cserélhető egységekben gondolkozni. Két kulcsszó: kicsi, cserélhető.

Mi a kicsi? 500 sor? 200? Gyorsan végig futtatva egy kis projektemen, egy átlagos osztályomban *mindössze 10 döntési pont van*. Vagyis 10 if, stb.

Mi a cserélhető? Na ez a nehezebb. Korábban beszéltünk interfacekről, mint egységesítő felületekről. Nézzünk egy példát [az egyik projektemből](https://github.com/opsbears/piccolo-web-router-fastroute). A routing folyamatra definiáltam egy interface-t, ami így néz ki:

```
interface Router {
    /**
     * @param ServerRequestInterface $request
     *
     * @return RoutingResponse
     */
    public function route(ServerRequestInterface $request);

    /**
     * @return RoutingResponse
     */
    public function getNotFoundRoute();

    /**
     * @return RoutingResponse
     */
    public function getServerErrorRoute();
}
```

Magyarán elvárom, hogy bármilyen routing megoldást is szeretnék használni, ezt a három függvényt implementálni kell. Van olyan routing könyvtár, ami pontosan ezt implementálja? Persze, hogy nincs. Vagyis ha behúzok egy külső könyvtárat erre a feladatra, kénytelen vagyok egy adapter réteget írni hozzá. Például így:

```
class FastRouteRouter
    implements Router {

    public function __construct($routes, $errorHandlers) {
        // Store the configuration in the class
    }

    public function route(ServerRequestInterface $request) {
        // Call external library
        $routing = new FastRouteRouter();
        // ...
    }

    //...
}
```

Ha megnézed, van egy olyan osztályom, amit kifejezetten ehhez az egy külső könyvtárhoz írtam. Mi történik, ha le akarom cserélni ezt a függvény könyvtárat? Ha jól csináltam a dolgomat, akkor kizárólag ezt az egy osztályt kell lecserélnem egy másik megvalósításra, a programom többi része érintetlen marad.

Teljesen mindegy, hogy külső függvény könyvtárról van-e szó vagy belső működésről, érdemes ilyen módon elválasztani az alkalmazás darabjait egymástól, és az alkalmazást a frameworktől.

Na de hogyan működik ez egy konkrét esetben? Három kritikus pont van, ahol könnyű túlságosan rágyógyulni a frameworkre.

![](assets/uploads/2016/07/framework-architecture.001.png)

### A controllerek

Jobb esetben a controllereink csak sima osztályok, fogalmuk sincs a framework létezéséről. Nézhet ki pl így:

```
class BlogController {
    public function showAction() {
        // ...
    }
}
```

Látható, hogy nincs semmilyen külső függőség. Vigyázni akkor kell, ha a framework dokumentációja azt kéri tőlünk, hogy örököljünk a frameworktől, például így:

```
class BlogController <ins>extends FrameworkAbstractController</ins> {
    public function showAction() {
        // ...
    }
}
```

Ez esetben ugyanis a controllerünk teljes mértékben ráépül a framework által nyújtott controller funkcionalitásra. Ez jobb esetben nem történik meg.

<q>Jó jó, de akkor hogy kapja meg a controllerünk a szükséges paramétereket?</q> — kérdezhetnéd Te. A válasz az, mint már korábban tárgyaltuk az, hogy [Dependency Injection](https://www.refaktor.hu/tiszta-kod-7-resz-mi-a-fene-az-a-dependency-injection-container/). Az az bekérhetjük őket paraméterként:

```
class BlogController {
    public function showAction(<ins>ServerRequest $request</ins>) {
        // ...
    }
}
```

Egy jó framework ezzel fog tudni mit kezdeni és átadja a kért adatokat. A `ServerRequest` ez esetben egy framework-független lekérdezés (request) objektum, ami PHP esetében például a [PSR-7 szabványban](http://www.php-fig.org/psr/psr-7/) került definiálásra.

Azonban vigyázat! Ha a controllerünkbe framework osztályokat kérünk be dependency injectionnel, a controllerünk ráépül ezekre az osztályokra! Tipikus példa erre a form (űrlap) kezelés, amire a frameworkök készséggel állnak rendelkezésre.

Természetesen eldönthetjük azt, hogy a controllereink ráépülnek a keretrendszerre, de ez esetben még inkább fontos az, hogy **az üzleti logika ne a controllerekben legyen**, ugyanis egy verzió váltáskor előfordulhat az, hogy a controllereink egy részét nagyobb módosításnak kell alávetnünk, vagy akár ki is kell dobnunk.

### Adatbázis kezelés

Semmi kétség nem fér hozzá, minden modern alkalmazásnak szüksége van valamilyen hosszú távú tároló megoldásra. A legtöbb framework nyújt is ilyen megoldást, legtöbbször valamilyen ORM megoldás keretében. A Laravel ezt például az Eloquent nevű ORM réteggel oldja meg. A Laravel tutorial szerint így használandó:

```
class Task extends Illuminate\Database\Eloquent\Model {
    //...
}
```

A korábbi példa alapján már látjuk is a problémát. A *modelljeink* közvetlenül rajta lógnak a framework által biztosított ősosztályon. Vagyis az ORM réteg cseréje maga után vonja azt is, hogy az összes modellhez, vagy ha jobban tetszik, *entityhez* hozzá kell nyúlni.

Ezt lehetőség szerint szeretnénk elkerülni, hiszen ezek a modellek vagy entityk az üzleti logikánk szerves részét képezik.

A [Doctrine ORM](http://www.doctrine-project.org/projects/orm.html) ebből a szempontból jobb választás lehet, hiszen [egy külső XML vagy YAML konfigurációs állományban adhatjuk meg](http://docs.doctrine-project.org/projects/doctrine-orm/en/latest/reference/basic-mapping.html), hogy melyik entityt melyik táblába kell letárolni, az entitynek nem szükséges a Doctrine ősosztályt megvalósítania.

Azt sajnos nem fogjuk tudni elkerülni, hogy valamilyen módon meghívjuk a Doctrine függvényeit az entitások betöltéséhet vagy tárolásához, de ez terv szerint az alkalmazásunk legalsó rétege, an Entity Gateway, aminek csak ez az egy feladata van. Ha ORM-et használunk, szinte elkerülhetetlen, hogy az alkalmazásunk legalsó rétege valamilyen szinten összefüggjön a frameworkkel. Ez lehet például ilyen:

```
class DoctrineBlogPostEntityGateway
    extends EntityGateway
    implements BlogPostBySlugGateway {

    private $em;
    public function __construct(EntityManager $em) {
        $this->em = $em;
    }

    public function getBySlug(string $slug) : BlogPost {
        $blogPostRepository = $this->em->getRepository('BlogPost');
        return $blogPostRepository->findOneBy(['slug' => $slug]);
    }
}
```

Mint látható, ha le szeretnénk cserélni a Doctrine-t ebben az esetben, csak és kizárólag az entity gatewayt kell újraírnunk, hiszen a működése interfacekkel szabványosított és a Doctrine nem lóg ki ebből a rétegből.

### Felhasználó kezelés, autentikáció

Gondolkodjunk egy pillanatig: a felhasználó kezelés a legtöbb esetben az üzleti logikánk része. Az üzleti logikáról pedig azt mondtuk, hogy ott semmi keresni valója nincs a frameworknek, hiszen ezt szeretnénk hosszú távon használni.

Van-e mégis megoldás arra, hogy külső függvénykönyvtárat vagy akár frameworköt használjunk a felhasználó kezelésünkhöz?

Természetsen van, de nagyon nagyon óvatosnak kell lennünk, illetve figyelembe kell vennünk, hogy adott esetben a felhasználó kezelést ki kell dobnunk és újra kell írnunk, ha a framework nekünk nem tetsző módon változik.

Nézzünk egy példát. Definiáljunk egy interfacet a felhasználó azonosításra:

```
interface Authenticator {
    /**
     * @throws AuthenticationException
     */
    public function authenticateByUsernameAndPassword(
        string $username,
        string $password
    ) : UserEntity;
}
```

Ez az interface lehetővé teszi azt, hogy definiáljunk egy olyan modult, ami felhasználónév és jelszó alapján azonosít és visszaad egy UsetEntity objektumot. Fontos megjegyezni, hogy ebben a környezetben a `UserEntity` és az `AuthenticationException` osztályok a saját üzleti logikánk részei, nem használhatjuk a külső könyvtár vagy framework osztályait erre a célra.

Ha hasonlóan járunk el a felhasználó kezelés minden egyes funkciójára, egy olyan leválasztó réteget kapunk, amely segítségével bármikor kidobhatjuk az eddigi felhasználó kezelést és implementálhatunk egy másikat.

### Framework frissítés

Mi történik, ha bekövetkezik az a rettegett eset, hogy a frameworköt vagy függvény könyvtárat frissíteni vagy cserélni kell? Ha jól végeztük a dolgunkat és minden ponton interfacekkel leválasztottuk a függőségeket, ez a folyamat ugyan munkaigényes, de remélhetőleg nem túl bonyolult. Pontosan tudjuk, hogy mit kell átnézni, remélhetőleg rendelkezünk néhány integrációs tesztel is, amik azonnal visítanak, ha az adott modul nem az elvárt módon viselkedik.

Teljesen egyértelmű, hogy ez a fajta architektúra az elején munkába kerül. Nem leszel kész egy hét alatt az MVP-vel, de cserébe egy év múlva is karbantartható lesz a kódod. Mi a fontosabb? Most egy héttel korábban kész lenni, vagy egy év múlva megspórolni pár emberhónap munkát egy nagyobb frissítéskor?

### Kell ez nekem?

Lássuk be, a modern frameworkök szépen meghíztak. Egy Symfony alaptelepítés több mint 300 000 sor kód, a Laravel pedig 80 000. Ez rengeteg, főleg ha nem ismerjük mélységeiben az adott rendszert. Egy-egy probléma esetén a hibakeresés akár heteket is igénybe vehet, mert ízeire kell szedni a használt keretrendszert. Ha a fentebb leírtakat akarjuk követni, csak módjával élvezhetjük az előnyöket, mivel minden egyes funkcióhoz absztrakciós réteget kell írnunk, vagy megkockáztatjuk, hogy az adott kapcsolódó pontot kénytelenek leszünk kidobni egy nagyobb frissítéskor.

Érdemes tehát megfontolni, hogy a nagy frameworkök helyett nem érdemes-e egy kisebb, átláthatóbb rendszert használni, mint például a Lumen vagy a Silex.

Akárhogyan is legyen, a kódunk átlag életkora rohamosan növekszik. Egy sikeres projekt a PHP-s világban is simán él akár 10 évet is. Ez azt jelenti, hogy akár tetszik akár nem, kénytelenek vagyunk arra felkészülni, hogy a projekt alatt megváltozik a programnyelv, vagy a használt framework / függvénykönyvtár.

## Clean Code a gyakorlatban? Nem túlzás ez?

Az is felmerült a visszajelzésekben, hogy vajon mennyire reális az, hogy egy határidőkkel küzdő magyarországi kis- vagy középvállalkozás mennyire tudja a sorozatban ismertetett módszereket bevezetni?

Biztosan ismered Te is ezt a helyzetet: az ügyfél liheg a nyakadba, már rég kész kellene lenned, és még akkor TDD-zz? Joggal gondolhatod, hogy meghibbantam. Azt javaslom, hogy itt figyelj a kód minőségre, miközben már amúgy is ezer dolgod van?

Felteszem viszont a kérdést: mivel szívsz a legtöbbet a fejlesztés közben? A karrierem kezdetén ügynökségi projekteken dolgoztam, és annak idején rendszeres volt az, hogy a fellépő mindenféle hibák nyújtották meg a projektek egy jó részét.

Félreértés ne essék, nem azt mondom, hogy ess neki TDD-vel egy új projektnek, sőt! Ha még soha nem TDD-ztél, akkor ez jó eséllyel nem fog működni, ezt kénytelen leszel egy játszós projekten elsajátítani. Amit javasolnék az az, hogy a következő projektedet próbáld meg szétszedni szépen darabokra, hogy könnyebben tudj reagálni, ha változnak az igények. Ha csapatban dolgozol, nem árt ha erről egyeztetsz a kollégáiddal is. Egyrészt nem éri őket meglepetés, másrészt talán ők is kedved kapnak.

Ha aztán készen állsz arra, hogy TDD-t vezess be, először az üzleti logikádat próbáld meg körül tesztelni, ne rögtön az egész alkalmazásodnak ess neki. Fokozatosan terjeszd ki a teszt lefedettségedet. Ha felmerül egy bug, írj rá tesztet, hogy többet ne fordulhasson elő.

## Út a tisztább kódhoz

Érdemes szem előtt tartani, hogy a tiszta kód módszertannak az az értelme, hogy a nap végén a mi (fejlesztők) élete legyen könnyebb. Kevesebb bug, kevesebb feszültség az ügyfél oldaláról vagy a főnöktől. Éppen ezért érdemes rászánni az időt a megfelelő módszerek kikisérletezésére.

Nem minden projekten lesz 98% test coverage. Szép számmal vannak régi projektek is, ahol egyáltalán nem is lehetséges az egység tesztelés. Válogasd ki azokat a módszereket, technikákat, amikkel jobb munkát tudsz végezni.

Azt nem szabad elfelejteni, hogy valahol minket mint szakembereket minősít, ha gyenge minőségű, nehezen módosítható kódot adunk ki a kezünkből. Vagyis rá kell szánni az időt az önfejlesztésre, többnyire a munkaidőn kívül.