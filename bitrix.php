<?php
$answer = json_decode(file_get_contents('php://input'), true);
define('CRM_HOST', 'b24-nafnqn.bitrix24.ru'); // Ваш домен CRM системы
define('CRM_PORT', '443'); // Порт сервера CRM. Установлен по умолчанию
define('CRM_PATH', '/crm/configs/import/lead.php'); // Путь к компоненту lead.rest
define('CRM_LOGIN', 'mgenius38@gmail.com'); // Логин пользователя Вашей CRM по управлению лидами
define('CRM_PASSWORD', 'admin123'); // Пароль пользователя Вашей CRM по управлению лидами
$postData = array(
    'TITLE' => $answer['name'], // Установить значение
    'NAME' => $answer['name'],
    'COMMENTS' => 'Проверяю дополнительные поля',
    'PHONE_MOBILE' => $answer['number'],
    'UF_CRM_1534603845'=> $answer['age'], //возраст
    'UF_CRM_1534604978'=> $answer['photo'], //фото
    'EMAIL_WORK'=>$answer['email'],
    'UF_CRM_1534683734'=>'коллаген, гиалуроновая кислота, пептиды' , //список рекомендаций
    'UF_CRM_1534683801'=>$answer['Complexion'], //список характеристик кожи
    'UF_CRM_1534683766'=>$answer['main_problems']//список средств
);
if (defined('CRM_AUTH'))
{
    $postData['AUTH'] = CRM_AUTH;
}
else
{
    $postData['LOGIN'] = CRM_LOGIN;
    $postData['PASSWORD'] = CRM_PASSWORD;


}
$fp = fsockopen("ssl://".CRM_HOST, CRM_PORT, $errno, $errstr, 30);
if ($fp)
{
    $strPostData = '';
    foreach ($postData as $key => $value)
        $strPostData .= ($strPostData == '' ? '' : '&').$key.'='.urlencode($value);
    $str = "POST ".CRM_PATH." HTTP/1.0\r\n";
    $str .= "Host: ".CRM_HOST."\r\n";
    $str .= "Content-Type: application/x-www-form-urlencoded\r\n";
    $str .= "Content-Length: ".strlen($strPostData)."\r\n";
    $str .= "Connection: close\r\n\r\n";
    $str .= $strPostData;
    fwrite($fp, $str);
    $result = '';
    while (!feof($fp))
    {
        $result .= fgets($fp, 128);
    }
    fclose($fp);
    $response = explode("\r\n\r\n", $result);
    $output = '<pre>'.print_r($response[1], 1).'</pre>';
    echo $output;
}
else
{
    echo 'Connection Failed! '.$errstr.' ('.$errno.')';
}

?>



