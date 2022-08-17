<?php
/**
 * @package Chums Inc
 * @subpackage Imprint Status
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2011, steve
 */

require_once ("autoload.inc.php");
require_once ("access.inc.php");

enable_error_reporting(true);

$bodyPath = "apps/pricelevels";
$title = "Price Level View/Edit";
$description = "or, how to get maintian all those freakin' price levels";

$ui = new WebUI($bodyPath, $title, $description, true, 5);
$ui->version = "2017.12.05";
$ui->bodyClassName = "container-fluid";
$ui->setBodyFile('body.react.html');
$ui->addManifest("public/js/manifest.json");
$ui->AddCSS("public/styles.css");

$ui->Send();
