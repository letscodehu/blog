---
id: 970
title: 'Tiszta kód, 8. rész – Egy tiszta kód blog kezdetei'
date: '2016-05-17T09:05:44+02:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=970'
permalink: /2016/05/17/tiszta-kod-8-resz-egy-tiszta-kod-blog-kezdetei/
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
    - '5757'
avada_post_views_count:
    - '5761'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
amazonS3_cache:
    - 'a:2:{s:53:"//www.letscode.huassets/uploads/2016/05/blog.png";a:2:{s:2:"id";s:4:"2059";s:11:"source_type";s:13:"media-library";}s:76:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2016/05/29123005/blog.png";a:2:{s:2:"id";s:4:"2059";s:11:"source_type";s:13:"media-library";}}'
image: 'assets/uploads/2016/05/29123011/53950429_m_cropped.png'
categories:
    - Fejlesztés
tags:
    - 'clean code'
    - Entity-Boundary-Interactor
---

Az elmúlt hetekben rengeteget beszéltünk a különböző tiszta kódhoz kapcsolódó koncepciókról, elvekről és tervezési mintákról. Eljött az idő, hogy implementáljuk egy teljes projektet, elejétől a végéig, a tiszta kód módszerrel.  
  
Hogy átlátható maradjon, egy viszonylag egyszerű feladatot választottam, egy blog implementálását. Feltételeztem, hogy van egy ügyfelem, aki kifejezetten saját fejlesztésű blogot szeretne, WordPress-szel és hasonló rendszerekkel rossz tapasztalatai vannak. Sajnos, ahogy az lenni szokott, az ügyfél nagyon keveset mondott arról, hogy mit is szeretne. Sőt mi több, a megrendelést ugyan aláírta, de még egyeztetnek a designerrel, hogy hogyan is nézzen ki. Annyi információt sikerült kipréselni belőle, hogy egy szabványos LAMP tárhelyet hajlandó kifizetni (kb. 10.000 Ft per év), de konkrét szolgáltatót nem tudott megnevezni.

Ezeket figyelembe véve megpróbálunk már előre dolgozni, összerakni a blogmotort párhuzamosan a design pontosításával. Mivel nagyon keveset tudunk a projekt követelményeiről, megpróbáljuk a lehető legegyszerűbb változatot implementálni, és igény szerint bővíteni, vagyis megpróbálunk minél több döntést elhalasztani, hiszen bármihez jöhet módosítási kérés.

Mielőtt neki esünk a kódolásnak, beszélünk a projekt menedzserünkkel, és világossá tesszük, hogy az ő feladata lesz bennünket az ügyfél felmerülő igényeiről mihamarabb tájékoztatni. Miután egy agile módszertannal működő csapat vagyunk, eldöntjük, hogy ezekre a napi standup kapcsán kerítünk sort.

> Figyelem! Ez a cikk erősen épít a sorozatban korábban írtakra, így az olvasást a sorozat elején érdemes kezdeni!

## Projekt setup

<div class="fusion-table table-1">|  | <th>Munkaidő:</th> |  | 10 perc |  |
|---|---------------------|---|---------|---|

</div>> Ha soknak érzed az egyes lépésekre fordított munkaidőt, mérd le a sajátodat! Meg fogsz lepődni!

Miután így biztosítottuk a hátországot, összeülünk a fejlesztőcsapattal és eldöntjük, hogy hogyan fogunk neki. Egy szabványos LAMP tárhelyet feltételezve, szinte biztos, hogy PHP-ban leszünk kénytelenek dolgozni, a Java és Ruby / Ruby on Rails tárhelyek ennél többe kerülnek. Az is szinte biztos, hogy MySQL jár a tárhelyhez, de mivel a múltban már egyszer megégettük magunkat ezzel és át kellett állni egy PostgreSQL szerverre, szintén elhalasztjuk az adatbázisról szóló döntést.

Architekturálisan [a korábban ismertetett EBI tervezési mintát](https://www.refaktor.hu/tiszta-kod-6-resz-beszelnunk-kell-az-mvc-rol/) fogjuk használni, a fejlesztést pedig a rendszer magjával kezdjük. Teszteléshez a PHP-s világban szokványos [PHPUnitot](https://phpunit.de/) fogjuk használni.

Mint már említettük, igen keveset tudunk a blogról, így sem kategóriákat, sem pedig címkéket (tageket) nem fogunk implementálni. Az ügyfélről feltételezhető, hogy SEO szempontjai vannak, így a Szerző (Author) entityt bevezetjük.

Ezzel el is kezdhetjük a kódolást. Ahogy az a PHP világban szokás, [composert](https://getcomposer.org/) használunk a különböző külső függőségek és az autoload kezelésére. Ennek megfelelően létrehozzuk a következő `composer.json` fájlt:

```
{
  "name": "refaktormagazin/blog",
  "minimum-stability": "stable",
  "license": "MIT",
  "autoload": {
    "psr-4": {
      "Refaktor\\Blog\\": "./src"
    }
  },
  "authors": [
    {
      "name": "Janos Pasztor",
      "email": "janos@pasztor.at"
    }
  ],
  "require": {
  },
  "require-dev": {
    "phpunit/phpunit": "^5.3.0",
    "phpmd/phpmd": "^2.4.0"
  }
}
```

Ezen felül bemásoljuk a cégnél szabványosított `phpunit.xml` fájlt is:

```
<phpunit
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:noNamespaceSchemaLocation="http://schema.phpunit.de/5.3/phpunit.xsd"
        convertErrorsToExceptions="true"
        convertNoticesToExceptions="true"
        convertWarningsToExceptions="false"
        beStrictAboutTestsThatDoNotTestAnything="false"
        checkForUnintentionallyCoveredCode="false"
        beStrictAboutOutputDuringTests="true"
        beStrictAboutChangesToGlobalState="true"
        stopOnError="true"
        stopOnWarning="true"
        bootstrap="vendor/autoload.php">
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
        <log type="coverage-html" target="build/logs/coverage.html"/>
        <log type="coverage-clover" target="build/logs/clover.xml"/>
    </logging>
</phpunit>
```

Ezen felül bemásoljuk a `phpmd.xml` konfigurációs állományunkat is, hogy azonnal észrevegyük, ha elszaladt velünk a ló és túl bonyolult függvényeket írunk:

```
<?xml version="1.0"?>
<ruleset name="Refaktor code rules"
         xmlns="http://pmd.sf.net/ruleset/1.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://pmd.sf.net/ruleset/1.0.0 http://pmd.sf.net/ruleset_xml_schema.xsd"
         xsi:noNamespaceSchemaLocation="http://pmd.sf.net/ruleset_xml_schema.xsd">
    <description>
        Refaktor ruleset
    </description>

    <rule ref="rulesets/unusedcode.xml" />

    <rule ref="rulesets/codesize.xml" >
        <exclude name="CyclomaticComplexity" />
        <exclude name="TooManyPublicMethods" />
    </rule>
    <rule ref="rulesets/codesize.xml/CyclomaticComplexity">
        <properties>
            <property name="reportLevel" value="30" />
        </properties>
    </rule>
    <rule ref="rulesets/codesize.xml/TooManyPublicMethods">
        <properties>
            <property name="maxmethods" value="20" />
        </properties>
    </rule>

    <rule ref="rulesets/controversial.xml" />
    <rule ref="rulesets/design.xml">
        <exclude name="CouplingBetweenObjects" />
    </rule>
    <rule ref="rulesets/design.xml/CouplingBetweenObjects">
        <properties>
            <property name="minimum" value="25" />
        </properties>
    </rule>

    <rule ref="rulesets/naming.xml">
        <exclude name="LongVariable" />
        <exclude name="BooleanGetMethodName" />
    </rule>
    <rule ref="rulesets/naming.xml/LongVariable">
        <properties>
            <property name="maximum" value="30" />
        </properties>
    </rule>
</ruleset>
```

Mivel a cégünknek nincs rendszergazdája, a [Travis-CI](https://travis-ci.org/) continuous integration szerverrel dolgozunk. Ez minden commit után leellenőrzi, hogy lefutnak-e még a unit tesztjeink. Ha lenne rendszergazdánk, [Jenkinst](https://jenkins.io/) használnánk. Vagy [TeamCityt](https://www.jetbrains.com/teamcity/). Esetleg [Gitlab CI](https://about.gitlab.com/gitlab-ci/)-t. Lényeg a lényeg, létrehozzuk a .travis.yml fájlt a következő tartalommal:

```
language: php
php:
  - '5.6'
  - '7.0'
  - hhvm
before_script:
  - composer self-update
  - composer install --prefer-source --no-interaction
script:
  - vendor/bin/phpunit
  - vendor/bin/phpmd src/ text phpmd.xml
```

## Entityk

Miután így felvérteztük magunkat, kellő biztonsággal láthatunk neki az Entityk gyártásának. Mivel ez a rész az üzleti logikánk magját képezi, [itt TDD-t fogunk alkalmazni](https://www.refaktor.hu/tiszta-kod-4-resz-tdd-a-gyakorlatban/).

> A projektet lépésről lépésre fejlesztettem, hogy nyomon tudd követni. [Ezeket a lépéseket megtalálod GitHubon](https://github.com/refaktormagazin/blog/releases).

### BlogPost

A blog postunk fogja tárolni a blog post tartalmát. Természetesen teszteket is írunk, ezeket [megtalálod GitHubon](https://github.com/refaktormagazin/blog/blob/0.0.1/tests/BlogPostTest.php). Ezt később átneveztem `BlogPostEntity`-re az olvashatóság kedvéért.

<div class="fusion-table table-1">|  | <th>Git verzió:</th> |  | [0.0.1](https://github.com/refaktormagazin/blog/releases/tag/0.0.1) |  |
|---|-----------------------|---|---------------------------------------------------------------------|---|
|  | <th>Munkaidő:</th> |  | 4 perc |  |
|  | [![](https://travis-ci.org/refaktormagazin/blog.svg?branch=0.0.1)](https://travis-ci.org/refaktormagazin/blog) |  |

</div>```
<?php

namespace Refaktor\Blog;

/**
 * Blog post entity
 */
class BlogPost {

    /**
     * @var string
     */
    private $slug;

    /**
     * @var string
     */
    private $title;

    /**
     * @var string
     */
    private $content;

    /**
     * @return string
     */
    public function getSlug() {
        return $this->slug;
    }

    /**
     * @param string $slug
     *
     * @return $this
     */
    public function setSlug($slug) {
        $this->slug = $slug;

        return $this;
    }

    /**
     * Set the title of the blogpost.
     *
     * @return string
     */
    public function getTitle() {
        return $this->title;
    }

    /**
     * Set the title of the blogpost. If the slug is not set,
     * it automatically generates a slug
     *
     * @param string $title
     *
     * @return $this
     */
    public function setTitle($title) {
        $this->title = $title;

        if (!$this->getSlug()) {
            $slug = \preg_replace('/[^a-zA-Z0-9\/_|+ -]/', '', $title);
            $slug = \strtolower(\trim($slug, '-'));
            $slug = \preg_replace('/[\/_|+ -]+/', '-', $slug);
            $this->setSlug($slug);
        }

        return $this;
    }

    /**
     * @return string
     */
    public function getContent() {
        return $this->content;
    }

    /**
     * @param string $content
     *
     * @return $this
     */
    public function setContent($content) {
        $this->content = $content;

        return $this;
    }
}
```

Ezen a ponton nem tudunk tovább fejleszteni ezen az entityn, hiszen szükségünk van a szerzőre. Éppen ezért hozzuk létre a `BlogAuthor` entityt (később átnevezve `BlogAuthorEntity`-re.)

<div class="fusion-table table-1">|  | <th>Git verzió:</th> |  | [0.0.2](https://github.com/refaktormagazin/blog/releases/tag/0.0.2) |  |
|---|-----------------------|---|---------------------------------------------------------------------|---|
|  | <th>Munkaidő:</th> |  | 3 perc |  |
|  | [![](https://travis-ci.org/refaktormagazin/blog.svg?branch=0.0.2)](https://travis-ci.org/refaktormagazin/blog) |  |

</div>```
<?php

namespace Refaktor\Blog;

/**
 * A person authoring a BlogPost
 */
class BlogAuthor {
    /**
     * @var string
     */
    private $name;

    /**
     * @return string
     */
    public function getName() {
        return $this->name;
    }

    /**
     * @param string $name
     *
     * @return $this
     */
    public function setName($name) {
        $this->name = $name;

        return $this;
    }
}
```

Most hogy van `BlogAuthor` entitynk, hozzáadhatjuk a `BlogPost`hoz (természetesen megint tesztekkel).

<div class="fusion-table table-1">|  | <th>Git verzió:</th> |  | [0.0.3](https://github.com/refaktormagazin/blog/releases/tag/0.0.3) |  |
|---|-----------------------|---|---------------------------------------------------------------------|---|
|  | <th>Munkaidő:</th> |  | 2 perc |  |
|  | [![](https://travis-ci.org/refaktormagazin/blog.svg?branch=0.0.3)](https://travis-ci.org/refaktormagazin/blog) |  |

</div>```
/**
 * @var BlogAuthor
 */
private $author;
/**
 * @return BlogAuthor
 */
public function getAuthor() {
    return $this->author;
}
/**
 * @param BlogAuthor $author
 *
 * @return BlogPost
 */
public function setAuthor(BlogAuthor $author) {
    $this->author = $author;
    return $this;
}
```

### Peer review

<div class="fusion-table table-1">|  | <th>Munkaidő:</th> |  | 1 óra vita, 25 perc implementáció |  |
|---|---------------------|---|--------------------------------------|---|

</div>Egészen eddig egyedül dolgoztam az entityken, de nem akarok tovább menni, mielőtt valaki más rá nem nézett volna. Éppen ezért megkérem a fejlesztő kollégákat, hogy nézzenek rá és vigyék fel a javaslataikat [issuekba GitHubon](https://github.com/refaktormagazin/blog/issues?utf8=%E2%9C%93&q=milestone%3A0.0.4+). Azért nem egy papírral a kezemben mentem oda, mert lássuk be, fejlesztők vagyunk, könnyebben írunk és olvasunk kódot, mint valami absztrakt ábrát. A javaslatok formalizált felvitelét pedig azért választottam, mert egyrészt fizikailag más helyen vagyunk (avagy távmunka), másrészt így nyoma marad, hogy mit miért változtattunk és később egyszerűbb lesz visszakeresni a döntést.

### Kockázatok és mellékhatások tekintetében...

Néhány apróság mellett két fontos dologra fény derült: egyrészt szükségünk lesz egy publikálási időpontra, hiszen szeretnénk rendezni, másrészt [a `setTitle()` mellékhatással rendelkezik](https://github.com/refaktormagazin/blog/issues/1). Magyarán nem csak azt csinálja, amit a neve elárul, hanem hozzányúl a slughoz is, ami nem várt hatást eredményez. Éppen ezért ezt a fajta funkcionalitást ki kell mozgatnunk a `setTitle()` függvényből.

Ezt két lépésben tesszük meg. Először kimozgatjuk egy külön függvénybe `setSlugFromTitle()` néven, így a meglevő unit tesztjeink le fognak futni. Utána pedig írunk egy olyan unit tesztet, ami ellenőrzi a mellékhatás megszűnését.

Tehát az első lépés:

```
public function setTitle($title) {
    $this->title = $title;

    <ins>if (!$this->getSlug()) {
        $this->setSlugFromTitle();
    }</ins>

    return $this;
}

/**
 * Autogenerate the slug from the title.
 */
public function setSlugFromTitle() {
    $slug = \preg_replace('/[^a-zA-Z0-9\/_|+ -]/', '', $this->getTitle());
    $slug = \strtolower(\trim($slug, '-'));
    $slug = \preg_replace('/[\/_|+ -]+/', '-', $slug);
    $this->setSlug($slug);
}
```

Ezzel meg is volnánk, jöhet a unit tesztek átalakítása. Ez volt az eredeti unit teszt a slug generálásra:

```
/**
 * @covers Refaktor\Blog\BlogPost::setTitle
 */
public function testCreateSlug() {
    //setup
    $blogPost = new BlogPost();
    //act
    $blogPost->setTitle('This is my test blog post');
    //assert
    $this->assertEquals('this-is-my-test-blog-post', $blogPost->getSlug());
}
```

Ehelyett most ezt a két tesztet fogjuk használni:

```
/**
 * @covers Refaktor\Blog\BlogPost::setTitle
 */
public function testNoAutoSlug() {
    //setup
    $blogPost = new BlogPost();
    //act
    $blogPost->setTitle('This is my test blog post');
    //assert
    $this->assertEquals('', $blogPost->getSlug());
}

/**
 * @covers Refaktor\Blog\BlogPost::setSlugFromTitle
 */
public function testCreateSlug() {
    //setup
    $blogPost = new BlogPost();
    //act
    $blogPost->setTitle('This is my test blog post');
    $blogPost->setSlugFromTitle();
    //assert
    $this->assertEquals('this-is-my-test-blog-post', $blogPost->getSlug());
}
```

### Karakterkódolás

Ha már itt vagyunk, felmerült az is, hogy a slug generálás adott esetben nem jól kezeli a karakterkódolást. Ha viszont megnézzük, hogy mennyi kódot kellene írnunk a rendes slug generáláshoz, hamar rájövünk, hogy a slug generálása egy **teljesen különálló feladat**, igazából semmi keresni valója nincs a `BlogPost` entityben.

Na jó, embereljük meg magunkat, emeljük ki a teljes slug generálást és hozzunk létre egy interface-t `SlugGeneratorInterface` néven, és egy alapvető implementációt `BasicSlugGenerator` néven:

```
/**
 * Declares the functions needed to generate a slug from a blog post title.
 */
interface SlugGeneratorInterface {
    /**
     * @param string $title
     *
     * @return string
     */
    public function generateSlug($title);
}

class BasicSlugGenerator implements SlugGeneratorInterface {
    public function generateSlug($title) {
        $slug = \preg_replace('/[^a-zA-Z0-9\/_|+ -]/', '', $title);
        $slug = \strtolower(\trim($slug, '-'));
        $slug = \preg_replace('/[\/_|+ -]+/', '-', $slug);
        return $slug;
    }
}
```

Természetesen ennek megfelelően kivesszük a slug generáláshoz kapcsolódó kódrészeket a BlogPostból. Na de, amiért egyáltalán hozzányúltunk ehhez a kódhoz: hogyan viselkedik a slug generálás, ha magyar ékezetes betűket adunk át neki? Írjunk egy egyszerű tesztet:

```
/**
 * @covers Refaktor\Blog\BasicSlugGenerator::generateSlug
 */
public function testHungarianCharacters() {
    //setup
    $basicSlugGenerator = new BasicSlugGenerator();
    //act
    //assert
    $this->assertEquals('arvizturo-tukorfurogep',
        $basicSlugGenerator->generateSlug('Árvíztűrő tükörfúrógép'));
}
```

Hát ez bizony nem túl fényes:

```
1) Refaktor\Blog\BasicSlugGeneratorTest::testHungarianCharacters
Failed asserting that two strings are equal.
--- Expected
+++ Actual
@@ @@
-'arvizturo-tukorfurogep'
+'rvztr-tkrfrgp'
```

Alakítsuk át a slug generálást úgy, hogy értelmesen konvertálja a magyar karaktereket is (hiszen magyar ügyfélnek dolgozunk):

```
public function generateSlug($title) {
    <ins>$replaceFrom = array('á', 'é', 'í', 'ó', 'ú', 'ö', 'ü', 'ő', 'ű');
    $replaceTo = array('a', 'e', 'i', 'o', 'u', 'o', 'u', 'o', 'u');

    $slug = mb_strtolower($title);
    $slug = str_replace($replaceFrom, $replaceTo, $slug);</ins>
    $slug = \preg_replace('/[^a-zA-Z0-9\/_|+ -]/', '', $slug);
    $slug = \strtolower(\trim($slug, '-'));
    $slug = \preg_replace('/[\/_|+ -]+/', '-', $slug);
    return $slug;
}
```

Megtehetnénk, hogy implementáljuk a világ minden nyelvére? Meg. Beköthetnénk külső függvénykönyvtárakat? Persze, ott az interface, azt implementálva játszi könnyedséggel írhatnánk egy adaptert. **Van rá igény? Nincs.** Ne implementáljunk olyat, amire nincs igény. Az ügyfél azért fizet, amit kért. Ha mi olyat implementálunk, amit nem kért, és ez bekerül a számlába, akkor joggal lesz felháborodva. Majd ha igénye lesz rá, mérlegelheti, hogy megéri-e neki a fejlesztés költsége.

## Az Interactor

<div class="fusion-table table-1">|  | <th>Git verzió:</th> |  | [0.0.4](https://github.com/refaktormagazin/blog/releases/tag/0.0.4) |  |
|---|-----------------------|---|---------------------------------------------------------------------|---|
|  | <th>Munkaidő:</th> |  | 1 óra 43 perc |  |
|  | [![](https://travis-ci.org/refaktormagazin/blog.svg?branch=0.0.4)](https://travis-ci.org/refaktormagazin/blog) |  |

</div>Na és itt kezd bonyolódni a dolog, ugyanis a következő konstrukciót szeretnénk megépíteni:

![blog](assets/uploads/2016/05/29123005/blog.png)

Ha ez ijesztően hat, ne félj, mindjárt szépen végig megyünk. Először is, gondoljuk végig, mit szeretnénk az interactorunktól? Szeretnénk, ha egy URL darabka alapján el tudnánk kérni egy blog postot, igaz?

Valahogy így:

```
$interactor = new BlogPostInteractor( ... );
$blogPostResponse = $interactor->getBlogPostBySlug('my-first-post');
```

Na, ez nem is bonyolult, csináljunk is erre rögtön egy interface-t:

```
/**
 * This interface declares the functions the fetching interactor
 * needs to implement.
 */
interface BlogPostBySlugBoundaryInterface {
    /**
     * Takes an URL part (slug) and looks for a blog post corresponding
     * to it. If it exists,  it is returned in a response.
     *
     * @param string $slug
     *
     * @return BlogPostBySlugResponse
     *
     * @throws BlogPostNotFoundBoundaryException
     *         if the given blog post was not found / is not available
     */
    public function getBlogPostBySlug($slug);
}
```

Gyakorlatilag itt azt írtuk le, hogy az az osztály, amely ezt az interface-t implementálja, kötelezően rendelkezzen egy `getBlogPostBySlug()` függvénnyel. Ezen felül leírja azt is, hogy milyen kötelező viselkedéssel rendelkezzen ez a függvény. Sajnos a PHP gyengén típusos nyelv, így nem tudjuk kikényszeríteni a visszatérési típust (PHP 7 előtt), így marad a viselkedés dokumentálása. Ha például Javaban programoznánk, erre is lenne mód, de hát nem lehet minden tökéletes.

Ha megfigyeled a kódot, ez a függvény nem közvetlenül a kért BlogPost objektummal tér vissza. Ennek az az egyszerű oka, hogy a jövőben előfordulhat olyan helyzet, hogy több információt is vissza akarunk adni, például az emellé a post mellé ajánlott további postokat, stb. A cél az, hogy ezek miatt a plusz infók miatt ne bontsuk meg a jelenlegi működést, ne kelljen az egész kódot átírni. Erre kiváló ez a `BlogPostBySlugResponse` objektum. Belerakjuk a plusz infókat, majd a front oldali kódot szépen apránként átírjuk. Nincs szükség egy hatalmas átírásra, ami jó eséllyel mindent tönkre tesz. Nézzük meg, mi van ebben az objektumban:

```
class BlogPostBySlugResponse {
    /**
     * @var BlogPostResponseObject
     */
    private $blogPost;

    public function __construct(BlogPostResponseObject $blogPost) {
        $this->setBlogPost($blogPost);
    }

    /**
     * @return BlogPostResponseObject
     */
    public function getBlogPost() {
        return $this->blogPost;
    }

    /**
     * @param BlogPostResponseObject $blogPost
     *
     * @return $this
     */
    public function setBlogPost($blogPost) {
        $this->blogPost = $blogPost;

        return $this;
    }
}
```

Ha most döbbent arccal nézel rám, hogy mi a fenét bonyolítok itt a `BlogPostResponseObject` típussal, és hol a fenébe van az előbb definiált `BlogPostEntity`, akkor teljesen igazad van. A boundaryn keresztüli kommunikációhoz nem az entityket használom.

Ennek az az egyszerű oka van, hogy amíg az üzleti logika, és ezzel az entity, változhat, addig szeretném, ha a boundaryhoz kapcsolódó objektumaim kompatibilisek maradjanak. Ne kelljen egyik napról a másikra átírni az összes olyan kódot, ami ezt az interactort használja. Elfedjük a belső működést.

Hogy fog kinézni ez a `BlogPostResponseObject` kérded Te? Kezdetnek pontosan ugyanúgy, mint a `BlogPostEntity`. És még mielőtt felhoznád, hogy ez bizony kód duplikálás: nem, nem az.

Emlékezzünk vissza arra, hogy mit tanultunk az [egy felelősség elvénél](https://www.refaktor.hu/tiszta-kod-5-resz-a-s-o-l-i-d-alapelvek/). Egy osztálynak egy, és csak egy *oka legyen a változásra*. Már pedig a `BlogPostEntity` és a `BlogPostResponseObject` **különböző okokkal rendelkezik a változásra**. Az előbbit akkor változtatjuk, ha változik az üzleti logika, az utóbbit pedig jó eséllyel csak bővítjük vagy kivonjuk a forgalomból, de soha nem változtatjuk meg a már meglevő működését.

Térjünk vissza egy pillanatra a boundary interfacere, illetve kezdjük el implementálni magát az interactort:

```
class BlogPostInteractor implements BlogPostBySlugBoundaryInterface {
    /**
     * {@inheritdoc}
     */
    public function getBlogPostBySlug($slug) {
    }
}
```

Eddig jó, de valahogy implementálni kellene. Na de hogyan? Mivel az interactor az üzleti logikánk magja, természetesen körül kell bástyáznunk tesztekkel. Pontosabban előbb írjuk meg a tesztet, utána a kódot.

### Az adatbázis-gateway

Gondolkozzunk csak... mit csinál ez a függvény? Betölti az adott URL darabhoz tartozó cikket az adatbázisból. Az *adatbázisból*... most ez azt jelenti, hogy a teszteléshez fel kell húznunk egy adatbázist? Szerencsére koránt sem, hiszen mint korábban megbeszéltük, szeretnénk leválasztani az adatbázist az üzleti logikánkról. Pontosan ezért, hiszen különben hogyan tesztelnéd?

Hozzunk létre erre is egy interface-t:

```
interface BlogPostBySlugGatewayInterface {
    /**
     * @param string $slug
     *
     * @return BlogPostEntity
     *
     * @throws EntityNotFoundException
     */
    public function getBySlug($slug);
}
```

Ez kísértetiesen hasonlít a fenti interfacere, de teljesen más szerepet tölt be. Ez az interface ugyanis azt a függvényt deklarálja, ami egy **entity betöltéséhez szükséges**. Ha használtál már MVC frameworköt, ezt a fajta megoldást adott esetben *Repository* néven is ismerheted.

Oké, de hogyan segít ez az interface a tesztelésben? Amire a válasz az, hogy itt írhatunk egy „kamu” gatewayt az igazi helyett. Ebbe a kamu adatbázisba a teszteléskor betöltjük a blogpostokat, és az interactort rávesszük, hogy ebből olvasson. Ez nézhet ki például így:

```
$postEntity1 = new BlogPostEntity();
$postEntity1->setSlug('test1');

$postEntity2 = new BlogPostEntity();
$postEntity2->setSlug('test1');

$entityGateway = new InMemoryBlogPostGateway(
                     array($postEntity1, $postEntity2));

$interactor    = new BlogPostInteractor($entityGateway);
```

### Vissza az interactorhoz

Miután ilyen elegánsan átadtuk az entity gatewayt az interaktornak, most már csak ebből kell dolgoznia, és mi nyugodtan írhatjuk a tesztünket a tényleges adatbázistól függetlenül. (Természetesen ezt az `InMemoryBlogPostGateway`-t is érdemes tesztelni, hiszen ha hibásan működik, az interaktor működése is hibás lesz.)

**Végig gondolva itt az interaktor feladata nem más, mint hogy megszerezze a szükséges entityt az entity gatewaytől (ami a maga részéről az adatbázist kérdezi). Ezt az entityt pedig lefordítja a szükséges válasz-objektumokra.**

A használata pedig rém egyszerű lesz:

```
$response = $interactor->getBlogPostBySlug('yolo');
$blogPost = $response->getBlogPost();
```

Ha összerakjuk az egészet egy tesztbe:

```
//setup
$postEntity = new BlogPostEntity();

$authorEntity = new BlogAuthorEntity();
$authorEntity->setName('John Doe');

$postEntity->setSlug('yolo');
$postEntity->setAuthor($authorEntity);
$postEntity->setPublishedAt(new \DateTime('1970-01-01 00:00:00'));
$postEntity->setTitle('My Yolo Blogpost!');
$postEntity->setContent('Hello world!');

$entityGateway = new InMemoryBlogPostGateway(array($postEntity));
$interactor    = new BlogPostInteractor($entityGateway);

//act
$response = $interactor->getBlogPostBySlug('yolo');
$blogPost = $response->getBlogPost();
$author   = $blogPost->getAuthor();

//assert
$this->assertInstanceOf('Refaktor\\Blog\\BlogPostResponseObject', $blogPost);
$this->assertInstanceOf('Refaktor\\Blog\\BlogAuthorResponseObject', $author);
$this->assertEquals('yolo', $blogPost->getSlug());
$this->assertEquals('John Doe', $author->getName());
$this->assertEquals('My Yolo Blogpost!', $blogPost->getTitle());
$this->assertEquals('Hello world!', $blogPost->getContent());
$this->assertEquals(
    new \DateTime('1970-01-01 00:00:00'),
    $blogPost->getPublishedAt());
```

Sok kód, de szépen olvasható.

## Minek ez az egész?

Mielőtt elbúcsúznánk, már csak egy dolgot kell megválaszolnunk: minek ez az egész?

Jelenleg a `BlogPostInteractor` gyakorlatilag tükörfordít az adatbázis és a webes kiszolgálás között, tehát haszontalan munkát végez. Éppen ezért egy projekt elején hajlamosak vagyunk gyorsan összedrótozni a részeket, és kihagyni ezt a fajta üzleti logika réteget.

Ahogy a projekt fejlődik, természetesen merülnek fel igények, és ha nincs meg ez a fajta üzleti logika réteg, a határidő által fenyegetett programozó természetesen nem fog neki állni szépen szétválasztani a felelősségeket, hiszen már így is késésben van. Ennek következtében aztán összemosódnak a felelősségek és megszületik az a katyvasz, amit mindannyian utálunk. A legtöbb projektben ez a katyvasz aztán még a projekt vége előtt a programozó nyakába zúdul, debugolni kell, és további késéseket okoz. A személyes tapasztalatom az, hogy ha az elejétől kezdve szétválasztjuk a felelősségeket, és szétbontjuk az alkalmazásunkat rétegekre, a projekt végén gyakorlatilag minimálisra csökken a debugolandó hibák száma, és azok is szinte triviálisak.

## A következő részben

Azt hiszem, ezen a ponton, kedves olvasó, már jojózik a szemed a sok objektumtól. Ha szeretnéd beleásni magad a kódba, [természetesen közzé tettük GitHubon](https://github.com/refaktormagazin/blog).

A következő részben azt nézzük meg, hogy hogyan kell tényleg hasznossá tenni ezt a hatalmas kódhalmazt amit itt sikerült össze gyártani. Beszélünk arról, hogy hogyan kapcsoljuk ezt össze egy frameworkkel, mind controller, mind adatbázis szinten, illetve hogyan lehet ezt framework nélkül használni.