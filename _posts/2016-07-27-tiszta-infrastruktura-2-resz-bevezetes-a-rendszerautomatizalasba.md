---
id: 1360
title: 'Tiszta infrastruktúra, 2. rész — Bevezetés a rendszerautomatizálásba'
date: '2016-07-27T07:18:55+02:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=1360'
permalink: /2016/07/27/tiszta-infrastruktura-2-resz-bevezetes-a-rendszerautomatizalasba/
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
    - '3807'
avada_post_views_count:
    - '3807'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
image: 'assets/uploads/2016/07/29123203/47805654_m.jpg'
categories:
    - Üzemeltetés
---

Számomra egy gyengén felépített infrastruktúra egyértelmű jele, amikor már egy SSH kulcs kimásolása is problémákba ütközik. Kézzel hegesztett konfigurációk, tarkabarka szerverek, kimaradt biztonsági frissítések, hiányzó monitorozás? Mit tehetünk ellene?  
  
Talán mondanom sem kell, az olcsó és elérhető virtualizációval és a felhő megjelenésével megsokszorozódtak a gépeink. Amíg régen egy szerverünk volt egy operációs rendszerrel, rajta sok szoftverrel, ma már inkább minden szoftverhez külön operációs rendszert indítunk. Ezzel nyilvánvalóan a gépek karbantartásával járó munka is megsokszorozódik.

Szerencsére ezzel a szemléletváltással megjelentek a hozzá való új eszközök is. Ezek közül ma a konfiguráció-menedzsment eszközökről lesz szó. Természetesen [rengeteg ilyen szoftver létezik](https://en.wikipedia.org/wiki/Comparison_of_open-source_configuration_management_software), de talán a leghíresebb, legtöbbet használt 4 a [Puppet](https://puppet.com/), a [Chef](https://www.chef.io/), az [Ansible](https://www.ansible.com/) és a [SaltStack](https://saltstack.com/).

Tisztázzuk mindjárt az elején: konfiguráció-menedzsment szoftverek terén mindegyiknek vannak előnyei és hátrányai. A Puppet például igen csak szereti a RAM-ot, cserébe viszont egyéni konfigurációs nyelvet biztosít. Ezzel szemben a Chefben például első sorban Rubyban programozzuk le a konfigurációnkat. Ha nem szeretnénk semmit telepíteni a szerverre, az Ansible lesz a megfelelő választás. Stb. Szóval feladathoz választunk eszközt. Ennek szellemében ebben a cikkben Puppettel mutatjuk be a konfigurációs példákat, ugyanez igen könnyen átültethető más eszközökre is.

> A cikk példái 3-as Puppetre íródtak! Amennyiben nem működnek, ellenőrizd a Puppet verziódat!

## Működési elv

Erősen leegyszerűsítve a konfiguráció-menedzsment rendszer elsődleges célja, hogy *erőforrásokat* kezeljen. Tehát például le szeretnénk írni azt, hogy egy megadott file tartalma legyen X, egy adott szolgáltatás mindig fusson, és hasonlóak. A cél, hogy mindig ez a kívánt állapot álljon elő, bármilyen állapotban is van jelenleg a rendszer.

Tegyük fel például, hogy szeretnénk egy adott felhasználót létrehozni minden gépen. Ezt Puppetben így tennénk meg:

```
user {
    "janoszen":
        comment => "Janos Pasztor",
        uid     => "5000",
        gid     => "5000",
        groups  => ["sudo"];
}
```

Ha szeretnénk ezt kipróbálni, mentsük le a `test.pp` fájlba a következőképp kiegészítve:

```
<ins>node default {</ins>
    user {
        "janoszen":
            comment => "Janos Pasztor",
            uid     => "5000",
            gid     => "5000",
            groups  => ["sudo"];
    }
<ins>}</ins>
```

A későbbiekben ezt a kódrészletet természetesen kibővíthetjük több féle node definícióval, a gép neve alapján különbséget téve a különböző konfigurációk között.

Hogy a konfigurációt le is teszteljük, futtassuk le a `puppet apply --noop test.pp` parancsot és lám, kiírja, hogy mit tett volna:

```
$ puppet apply --noop test.pp
Notice: Compiled catalog for sandbox in environment production in 0.17 seconds
<strong>Notice: /Stage[main]/Main/Node[default]/User[janoszen]/ensure: current_value absent, should be present (noop)</strong>
Notice: Node[default]: Would have triggered 'refresh' from 1 events
Notice: Class[Main]: Would have triggered 'refresh' from 1 events
Notice: Stage[main]: Would have triggered 'refresh' from 1 events
Notice: Finished catalog run in 0.02 seconds
```

Ha levesszük a `--noop` kapcsolót, a Puppet ezt ténylegesen végre is fogja hajtani. Ha ennyivel elégedettek vagyunk, akkor a test.pp fájlt elmenthetjük valahová permanensen, a `puppet apply` parancsot pedig időzítve futtathatjuk. Tárolhatjuk például egy git repóban is, így minden gépen automatikusan frissíthető, garantálva, hogy minden gép mindig a legaktuálisabb állapoton van.

## Architektúra

Az, hogy a konfiguráció menedzsment állományai minden gépen kint vannak, nem feltétlenül a leghatékonyabb megoldás. Egyrészt gondoskodni kell arról, hogy a legfrissebb Puppet kód mindig kint legyen minden gépen, másrészt a helyi futás rendelkezik néhány hátránnyal. Többek között azzal, hogy az összes gép összes kódja megtalálható a gépen, tehát egy támadó egy gép megtörésével valamennyi gépünk valamennyi konfigurációjához hozzájut.

Erre a problémára a konfiguráció-menedzsment rendszerek különböző megoldásokkal rendelkeznek. A Puppet például egy (vagy több) központi gépen futtatható *puppetmaster* folyamatban az adott gép kérésére legenerálja csak az adott gépre vonatkozó konfigurációt, amit a gépen futó *agent* végrehajt. Ezzel a munka nagy része a puppetmasterre hárul, az agent nem rendelkezik a teljes konfigurációval és jóval kevesebb memóriával is futhat.

Más rendszerek ezt a problémát másképp oldják meg, az Ansible például SSH-n csatlakozik a célgépekre és úgy hajtja végre a feladatokat, ezzel adott esetben szükségtelenné téve bármiféle külön szoftver telepítését.

## Modularizálás

Néhány szabály megírása után látni fogjuk azt, hogy bizony-bizony eléggé kezelhetetlenné válik a konfigurációnk, ha nem szedjük szét darabokra. Teljesen mindegy, hogy Puppetet, Chefet vagy más rendszert használunk, tisztában kell lennünk azzal, hogy itt *programozzuk* az infrastruktúránkat. Éppen ezért a Puppet kódunkra vonatkozóan ugyanúgy érdemes a tiszta kód sorozatban ismertetett elveket alkalmazni.

Ha mást nem, érdemes a konfigurációnkat modulokra bontani. Ha például felhasználókat kezelünk, akkor ott sokszor nem csak a felhasználó létrehozása fontos, hanem szeretnénk kitenni az SSH kulcsait, letenni a `.bashrc` fájlját, stb.

Mint írtam, minden konfiguráció-menedzsment rendszer más, ezért nehéz általános példát írni. Tegyük fel, hogy szeretnénk Puppetben létrehozni a felhasználót, majd letenni az SSH kulcsait. Ha csak egy felhasználóról van szó, ezt így tennénk meg:

```
user {
    "janoszen":
        comment => "Janos Pasztor",
        uid     => "5000",
        gid     => "5000",
        groups  => ["sudo"];
}

<ins>file {
    "/home/janoszen/.ssh":
        ensure => directory,
        mode   => 0700,
        owner  => "janoszen",
        group  => "janoszen";
    "/home/janoszen/.ssh/authorized_keys":
        ensure => file,
        mode   => 0600,
        owner  => "janoszen",
        group  => "janoszen",
        source => "puppet:///files/janoszen.keys";
}</ins>
```

Amellett, hogy a `janoszen.keys` fájlt le kell tennünk a Puppet files könyvtárába (alapértelmezetten `/etc/puppet/files`), tisztán látható, hogy ebből érdemes egy modult csinálni. Puppetben a saját erőforrás definiálása a `define` paranccsal történik. A fentieket a következőképpen lehetne erőforrásba foglalni:

```
define account ($realname, $uid, $groups) {
    user {
        $name:
            comment => $realname,
            uid     => $uid,
            gid     => $uid,
            groups  => $groups;
    }
    
    file {
        "/home/${name}/.ssh":
            ensure => directory,
            mode   => 0700,
            owner  => $name,
            group  => $name;
        "/home/${name}/.ssh/authorized_keys":
            ensure => file,
            mode   => 0600,
            owner  => $name,
            group  => $name,
            source => "puppet:///files/${name}.keys";
    }
}
```

> Tipp: Puppetben a `$name` automatikusan létezik és az erőforrás nevét jelenti.

Használni aztán így lehetne:

```
account {
    "janoszen":
        realname => "Janos Pasztor",
        uid      => 5000,
        groups   => ["sudo"];
}
```

Nos, ha ezzel megvagyunk, érdemes átolvasni a Puppet dokumentációját, hogy mindezt [hogyan kell a filerendszerben elhelyezni](https://docs.puppet.com/puppet/latest/reference/modules_fundamentals.html), illetve milyen további lehetőségeink vannak még.

## Bevezetés

Remélhetőleg a fenti példákból érezhető, hogy leginkább kedvcsinálónak szántam őket, nem pedig konkrét Puppet bemutatónak. (Erre a jövőben még sor kerül.) Viszont bármelyik konfiguráció-menedzsment rendszert is választod, néhány jó tanácsot érdemes megfogadni a bevezetéshez.

1. Ne akard mindjárt elsőre az egész rendszeredet automatizálni! Ha azt érzed, hogy inkább akadályoz mint segít, akkor túl sokat akartál túl gyorsan optimalizálni és feláldoztad a flexibilitást!
2. Kezdd az apró dolgokkal! Legyen kint minden felhasználó minden gépen, legyenek menedzselve az SSH kulcsok, a volt kollégák accountjai legyenek eltávolítva!
3. Ha kibővíted az automatizálást, azokat a feladatokat vedd elő, amik sok gépet érintenek, munkaintenzívek!
4. Időről időre ne sajnáld a fáradtságot és refaktoráld a moduljaidat, hogy továbbra is használhatóak maradjanak!
5. Verziókezeld a konfigurációdat!
6. Használd a [tiszta kód](https://www.refaktor.hu/tiszta-kod-1-resz-teszteljek-vagy-ne-teszteljek/) sorozatban megismert programozási ajánlásokat, módszereket!
7. Ha teheted, tarts 1-2 virtuális gépet tesztkörnyezetnek!
8. A rendszerautomatizáló eszköz fusson rendszeresen és automatikusan! Soha ne kapcsold ki a futtatást hosszabb időre, különben nem veszed észre, ha valaki kézzel belenyúlt a konfigurációba!