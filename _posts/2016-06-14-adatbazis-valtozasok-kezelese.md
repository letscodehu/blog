---
id: 1231
title: 'Adatbázis változások kezelése'
date: '2016-06-14T06:44:31+02:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=1231'
permalink: /2016/06/14/adatbazis-valtozasok-kezelese/
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
    - '2599'
avada_post_views_count:
    - '2605'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
image: 'assets/uploads/2016/08/09202219/Selection_002.png'
categories:
    - Alapozó
---

A tesztgépen még tökéletes volt, de az éles rendszeren hiányzik az adatbázis fele? Rémálom az élesítés? Beszélgessünk az adatbázis változások kezeléséről!

## A probléma

A problémát szinte mindenki ismeri, aki dolgozott már adatbázisokkal. Teszt környezetben működik, éles környezetben nem. Hosszas debugolás után kiderül, hogy hiányzik egy mező, vagy akár egy egész tábla, az éles adatbázisból.

## 1. megoldás: change scriptek

A koncepció elég egyszerű: ha változtatnunk kell az adatbázisok, a változást végrehajtó SQL parancsot felírjuk egy fájlba, és csinálunk egy programot ami ezeket szépen sorrendben végrehajtja. Például lehet egy ilyen mappánk:

- 0001.sql
- 0002.sql
- ...

A migrációs program természetesen feljegyzi, hogy melyik migráció került már végrehajtásra, és **csak az új migrációkat hajtja végre**.

Ez a fajta rendszer teremt egy érdekes lehetőséget. Ha a migrációkat rendesen karban tartjuk, bármikor felhúzhatjuk „nulláról” az adatbázist. Ha jön egy új fejlesztő a céghez, adunk neki egy üres adatbázist és végrehajtjuk a migrációkat, és máris kezdhet dolgozni a kolléga. Ennek természetesen az az előkövetelménye, hogy **minden változás benne legyen a scriptekben**.

> Ez a rendszer csak akkor működik jól, ha minden változást már fejlesztés közben is feljegyzünk a migrációs fájlokba! A legjobb, ha a fejlesztői adatbázis módosításait is kizárólag ezzel kezeljük!

> **Tudtad?**  
> Az olyan programok, mint a [MySQL Workbench](https://www.mysql.com/products/workbench/), le tudják generálni a change fájlokat. Így csak át kell nézned, de nem kell kézzel megírnod őket!

## 2. megoldás: struktúra leírások

A change scriptekkel egy komoly probléma van: ha hiba csúszik a scriptek konzisztenciájába, nem tudjuk nulláról lefuttatni őket, valahol megakad a folyamat és máris meredeken esik az egész migrációs folyamat értéke, mert nem tudunk nulláról felhúzni egy adatbázist.

Éppen ezért a migrációkra létezik egy másik megoldás is: a változások helyett azt írjuk le, hogy milyen legyen az adatbázis szerkezete. Például így:

```
<table name="customers">
    <column type="int" autoincrement="true">id</column>
    <column type="varchar(255)">firstName</column>
    ...
```

A migrációs programnak ez alapján ki kell találnia, hogy mely oszlopokat, táblákat kell hozzáadni vagy törölni az adatbázisból.

Ennek a módszernek van egy hatalmas hátránya: ha például olyan változásunk van, amely egyik oszlopból másol át adatokat egy másikba, azt ebben nehezen tudjuk leképezni.

## Összehasonlítás

Nézzük, hogy melyiknek mi az előnye, illetve a hátránya:

|  |  | <th><div align="center">Change scriptek</div></th> |  | <th><div align="center">Struktúra leírások</div></th> |  |
|---|---|----------------------------------------------------|---|----------------------------------------------------------|---|
|  | <th>Pozitívumok</th> |  | - Könnyen lekövethető változások
- Könnyen telepíthető fejlesztői adatbázisok
- Egyszerű migrációs program |  | - Garantált adatbázis struktúra
- Könnyen telepíthető fejlesztői adatbázisok |  |
|  | <th>Negatívumok</th> |  | - Fejlesztői fegyelmet követel
- Az adatbázis-változások nem tranzakcionálisak, így hiba esetén előállhat inkonzisztens állapot. |  | - Bonyolult migrációs program
- Nem minden változás írható le vele |  |

> Óvatosan az olyan rendszerekkel, amelyek struktúra leírásokból generálnak change scripteket! (pl. Doctrine) Ezek a rendszerek időnként belezavarodnak a módosításokba, ezért érdemes átnézni a generált migrációs fájlokat.

## Migrációk a gyakorlatban

A gyakorlatban szinte minden rendszer a change script megoldást használja. Ha szeretnénk bevezetni ezeket a migrációkat a rendszerünkbe, nincs más dolgunk, mint a jelenlegi adatbázis szerkezetet lementeni (pl. `mysqldump --no-data`) és betölteni az első migrációba.

Migrációs program gyanánt vagy használhatunk kész szoftvert (pl. [Doctrine Migrations](https://github.com/doctrine/migrations)) vagy akár írhatunk sajátot is, ahogy a [blog projekt](https://github.com/refaktormagazin/blog) kapcsán meg is tettük. Ebben a projektben mi egyszerűen felsoroltuk a migrációs osztályokat a konfig fájlunkban, a migrációs engine pedig szépen végig ment ezeken és végrehajtotta a benne levő SQL-eket. Így például a blog postok tábláját létrehozó migráció így néz ki:

```
class CreateBlogPostsTable extends Migration {
    function upgrade() {
        $this->getPDO()->query(/** @lang MySQL */
            '
            CREATE TABLE blogposts (
                slug VARCHAR(255) PRIMARY KEY,
                author VARCHAR(255) NOT NULL,
                title VARCHAR(255) NOT NULL,
                content MEDIUMTEXT NOT NULL,
                published_at DATETIME NOT NULL
            ) ENGINE=InnoDB;
            ');
    }
}
```

Egyszerű, ugye?

> **Tipp!**  
> Az adataidat ne tárold a change scriptjeidben, vagy ha mégis, teremtsd meg a lehetőséget arra, hogy ezek nélkül is le lehessen futtatni a migrációkat!