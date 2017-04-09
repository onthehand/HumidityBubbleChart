<?php
	header('Content-type:text/plain');
	define('LOG_PREFIX','./data/log_');
	define('LOG_SUFFIX','.txt');

	date_default_timezone_set('Asia/Tokyo');
	$timestamp = date('Y/m/d H:i:s');

	$id = 0;
	$h = 0;
	$t = 0;

	if ( isset($_GET['ID']) ){
		$tmp = filter_var($_GET['ID'], FILTER_VALIDATE_INT);
		if ( $tmp ) { $id = $tmp; }
	}
	if ( isset($_GET['H']) ){
		$tmp = filter_var($_GET['H'], FILTER_VALIDATE_FLOAT);
		if ( $tmp ){ $h = $tmp; }
	}
	if ( isset($_GET['T']) ){
		$tmp = filter_var($_GET['T'], FILTER_VALIDATE_FLOAT);
		if ( $tmp ){ $t = $tmp; }
	}
	if ( $h == 0 && $t == 0 && $id == 0 ){ echo 'NG'; return; }

	$log_msg = $timestamp.','.$h.','.$t."\n";

	$log_file = LOG_PREFIX.$id.LOG_SUFFIX;
	$fp = ( file_exists($log_file) )
		? fopen($log_file,'a')
		: fopen($log_file,'w');
	fwrite($fp,$log_msg);
	fclose($fp);

?>OK
