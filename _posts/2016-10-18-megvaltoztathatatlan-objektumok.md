---
id: 2000
title: 'Megváltoztathatatlan objektumok'
date: '2016-10-18T12:39:37+02:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=1845'
permalink: /2016/10/18/megvaltoztathatatlan-objektumok/
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
    - '3035'
avada_post_views_count:
    - '3035'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:0:"";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2016/10/29123414/44624989_ml_cropped.jpg'
categories:
    - Intermediate
tags:
    - oop
---

Objektum orientált programozásban gyakran használunk objektumokat adatok továbbítására. Ebben a cikkben egy olyan tervzési mintát szeretnék bemutatni, ami elsőre talán nem intuitív, de annál hasznosabb: ma az immutable objectekkel foglalkozunk.

Vegyük a kedvenc blogos példámat. Írunk egy blogmotort, ami [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) formátumban tárolja a cikkeket. Ahhoz, hogy megjelenítsük, ezeket át kell alakítanunk HTML-re, Facebook Instant Articles RSS feedre, stb.

Nézzük, hogy hogyan nézne ez ki. Először is deklaráljuk az osztályainkat.

\[graphviz\]digraph {  
node \[  
fontname = "Bitstream Vera Sans"  
fontsize = 8  
shape = "record"  
\]  
edge \[  
fontname = "Bitstream Vera Sans"  
fontsize = 8  
\]

BlogPost \[  
label="{BlogPost|- title : string\\l- text : string\\l|+ getTitle() : string\\l+ setTitle(string title) : void\\l+ getText() : string\\l+ setText(string text) : void\\l}"  
\]

BlogPostConverterInterface \[  
label="{\\<\\<interface>\\>\\lBlogPostConverterInterface|\\l|+ convert(BlogPost post) : BlogPost\\l}"  
\]</interface>\\>

BlogPostHTMLConverter \[  
label="{BlogPostHTMLConverter||+ convert(BlogPost post) : BlogPost\\l}"  
\]

BlogPostFacebookInstantArticlesConverter \[  
label="{BlogPostFacebookInstantArticlesConverter||+ convert(BlogPost post) : BlogPost\\l}"  
\]

BlogPostHTMLConverter -> BlogPostConverterInterface;  
BlogPostFacebookInstantArticlesConverter -> BlogPostConverterInterface;  
}\[/graphviz\]

Tehát adott két konvertáló osztály, ami a maga részéről is `BlogPost`-ot ad vissza, de már a konvertált tartalommal. Egy konvertáló kódja valahogy így nézhet ki:

```
class BlogPostHTMLConverter {
    public function convert(BlogPost post) : BlogPost {
        string content = post.getText();

        content = this.markDownConverter.convertToHTML(content);

        post.setText(content);

        return post;
    }
}
```

Mint látható, a convert() függvény egy fajta filtert valósít meg, átalakítja a tartalmat. Az átadott `BlogPost` objektumot ebben a folyamatban felhasználja és módosítja a tartalmát.

### Miért probléma ez?

A legtöbb modern OOP-s nyelvben az objektumok *referencia szerint* kerülnek átadásra. Azaz ha átadunk egy függvénynek egy objektumot, az nem egy másolat lesz, hanem hivatkozás ugyanarra az objektumra. Képzeljük el azt a helyzetet, amikor egy cache-t szeretnénk előmelegíteni, és ezért az összes konvertálót végig futtatjuk a blog post mentése után:

```
blogPost = new BlogPost();
htmlConverter     = new BlogPostHTMLConverter();
facebookConverter = new BlogPostFacebookInstantArticlesConverter();

htmlBlogPost      = htmlConverter.convert(blogPost);
facebookBlogPost  = facebookConverter.convert(blogPost);
```

Ez esetben a `blogPost` változó tartalma az első konvertálás során módosulni fog! A Facebook konverter már a HTML által módosított tartalmat kapja meg, mivel az objektumról a függvényhiváskor nem készül másolat, hanem csak egy hivatkozás, egy referencia kerül átadásra.

### A megoldás

Megtehetnénk azt, hogy az objektumunkról mindig másolatot készítünk, de ez esetben bíznunk kellene a konverterekben, hogy be is tartják ezt a szabályt. A gond ezzel az, hogy ha jön egy ifjú titán, frissen végzett egyetemista, aki nem ismeri a rendszert, nem biztos, hogy ezzel tisztában lesz és máris kész a bug. Arról persze nem is beszélve, hogy ha egy objektum további változójában egy további objektum van, az egész másolási művelet meglehetősen macerássá válik.

Helyette van egy másik megoldás is, méghozzá az immutable (megváltoztathatatlan) object használata. Ez röviden annyit takar, hogy nem engedjük meg egy objektum módosítását, hanem minden módosításkor egy új másolatot hozunk létre a módosított tartalommal.

Nézzük ezt a gyakorlatban:

```
class BlogPost {
    private string text;

    public function withText(string newText) : BlogPost {
        BlogPost newObject = clone this;
        newObject.text = newText;
        return newObject;
    }
}
```

Mint látható, a `withText` metódus egy másolatot hoz létre a clone segítségével. A legtöbb OOP-s nyelvben a private változók hozzáférhetőek az azonos típusú osztályokból, ezért a másolatban módosítani tudjuk a szöveg értékét. Végezetül pedig ezt a másolatot adjuk vissza.

Ezek után a konverterünk így nézne ki:

```
class BlogPostHTMLConverter {
    public function convert(BlogPost post) : BlogPost {
        string content = post.getText();

        content = this.markDownConverter.convertToHTML(content);

        <ins>return post.withText(content);</ins>
    }
}
```

Vagyis a `setText` helyett a `withText` metódust használjuk, és az eredménye pedig az új BlogPost objektum lesz, amit annak rendje és módja szerint vissza is adunk. Ezzel ellehetetlenítettük azt, hogy a konverterek belerondítsanak egymás munkájába.

### Az immutabilitás ára

Természetesen ennek ára van. Egyrészt minden egyes módosító függvényhívásnak lesz egy parányi, alig mérhető költsége az objektum létrehozásakor. Több ezer-tízezer ilyen hívásnál ez már összeadódhat, így lesznek olyan rendszerek, ahol ez az út nem járható.

Amire szintén oda kell figyelni, hogy ha immutable objectekkel dolgozunk, minden programrésznek fel kell készülnie arra, hogy fogadja a módosított objektum-másolatot. Hiszen hiába készítünk módosított másolatot, ha ezek után nincs kinek átadni. Ezt egy kis időbe telhet megszokni, ha eddig csak setter-getter módszerrel programoztunk adattárolókat.

### Előnyök a többszálú programozásban

Ha nem éppen PHP-ban programozunk, hanem mondjuk Javaban, egy-egy bonyolultabb program esetén szembesülünk azzal, hogy az objektumokat több szál is szeretné használni. Ez esetben oda kell figyelni arra, hogy a két szál teljesen függetlenül fut. Ez azt jelenti, hogy amíg az egyik szál több adatot módosít, a másik szálon ne olvassunk ki egy közbenső állapotot. Azaz zárolni kell az objektumot, ami várakozáshoz vezet.

Ez a probléma adott esetben megkerülhető immutable objectek alkalmazásával. Nézzük, hogy hogyan.

Tegyük fel, hogy van egy tömbünk, amiben a blog postjainkat tároljuk. Azaz `Array<BlogPost>`. Ezt a tömböt több szál is használja, ebből olvassák ki a kívánt postokat. Ha most az egyik szál szeretné módosítani az egyik postot, az immutable object megoldás miatt automatikusan másolat készül:

```
BlogPost modifiedPost = this.posts[42].withTitle('Yolo!').withText('Yolo!');
```

Nem fordulhat elő az az eset, hogy a `withTitle` és a `withText` hívás között egy másik szál kiolvassa a módosított címet az eredeti tartalommal párosítva. Ezek után a módosító szál természetesen vissza teheti a `this.posts` tömbbe a módosított postot, de az már egyetlen művelet lesz, így a többi szál vagy az eredeti postot olvassa ki, vagy az újat. Nincs olyan helyzet, amivel egy közbenső állapothoz juthatnánk.

### Objektum az objektumban

Az immutable objektumok sajnos az ellen nem védenek, hogy ha egy változóban egy további, nem immutable objektum található. Mint megbeszéltük, ekkor ugyanis a getter csak egy referenciát ad vissza a nevezett objektumra és ezen módosításokat végezhetünk. Tehát ha immutable objektumot szeretnénk, az objektum struktúránkban *csak és kizárólat immutable objektumok* lehetnek. Ez alól természetesen kivétel, ha maga a nyelv ad eszközt arra, hogy ezeket az objektumokat megvédjük.

### Összefoglaló

A módosíthatatlan objektumok kétségtelenül hasznos eszközt képviselnek egy modern programozó eszköztárában. Arra érdemes figyelni, hogy nem minden szög csak azért mert van egy kalapácsunk. Néha ezen módszer több hátránnyal jár mint előnnyel. Ha azonban a programunk különböző moduljai között kommunikálunk és nem akarunk minden alkalommal új objektumot létrehozni egy válaszhoz, mindenképpen érdemes megfontolni a használatát.