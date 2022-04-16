<?php

require_once __DIR__ . '/../vendor/tecnickcom/tcpdf/examples/tcpdf_include.php';

const FONTS = array("times", "timesb", "timesi", "timesbi",
 "helvetica", "helveticab", "helveticai", "helveticabi",
 "courier", "courierb", "courieri", "courierbi",
 "symbol", "zapfdingbats");


//  $id = 113776533273259442553;
//  $resume_id = 1;
//  $elements = array(
//      array(
//          "type" => "text",
//          "offset-x" => 100,
//          "offset-y" => 100,
//          "width" => 100,
//          "height" => 100,
//          "z-index" => 1,
//          "content" => "HelloWorld",
//          "prop" => array("font-type" => "times", "font-size" => 12)
//      ),
//      array(
//          "type" => "image",
//          "offset-x" => 150,
//          "offset-y" => 100,
//          "width" => 100,
//          "height" => 100,
//          "z-index" => 1,
//          "content" => "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",
//          "prop" => array()
//      )
// );
// generatePDF($resume_id, $elements);

function generatePDF($resume_id, $elements){


    $MAX_X = 629;
    $MAX_Y = 814;

    $resumeID = $resume_id;
    //By default everything is in mm.
    //8.5"x11" in mm
    $pageLayout = array(215.9, 279.4);
    $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, $pageLayout, true, 'UTF-8', false);
    $pdf->SetTitle($resumeID . '.pdf');

    // remove default header/footer, might not be needed
    $pdf->setPrintHeader(false);
    $pdf->setPrintFooter(false);
    $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
    $pdf->SetAutoPageBreak(false, 0);
    $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
    $pdf->SetMargins(0, 0, 0, true);

    $pdf->AddPage();


    foreach ($elements as &$element) {

        if($element["type"] === "text"){
            $x = $element["offset-x"];
            $y = $element["offset-y"];
            // $width = $element["width"]; //Don't think necessary
            // $height = $element["height"]; //Don't think necessary
            $z = $element["z-index"]; //Maybe just use see through textboxes? Don't need Z then
            $content = $element["content"];
            $prop = $element["prop"];
            $fontType = $prop["font-type"];
            $fontSize = $prop["font-size"];

            // https://tcpdf.org/docs/srcdoc/TCPDF/classes-TCPDF/#method_setFont
            // Not a lot of options for font right now. If we really want to, we can add some.
            if(in_array($fontType, FONTS)){
                $pdf->SetFont($fontType, '', $fontSize);
            }
            else{
                $pdf->SetFont('times', '', $fontSize);
            }
            //SetXY accepts floats in mm
            //TODO: Discuss best approach with frontend encoding.
            //Easily could set as $x/MAX_X * 215.9, $y/MAX_Y * 279.4
            $pdf->SetXY($x/$MAX_X * 215.9, $y/$MAX_Y * 279.4);
            //https://tcpdf.org/docs/srcdoc/TCPDF/classes-TCPDF/#method_Write
            $pdf->Write(0, $content, '', 0, 'L', true, 0, false, false, 0);
        }
        if($element["type"] === "image"){
            $x = $element["offset-x"];
            $y = $element["offset-y"];
            $width = $element["width"];
            $height = $element["height"];
            $z = $element["z-index"];
            $content = $element["content"]; //should be base64 encoded png
            //Do we need prop?

            $image = base64_decode($content);
            $x = $x/$MAX_X * 215.9;
            $y = $y/$MAX_Y * 279.4;
            $width = $width/$MAX_X * 215.9;
            $height = $height/$MAX_Y * 279.4;

            $pdf->Image('@'.$image, $x, $y, $width, $height);
        }
    }


    // $pdf->Write(0, $text, '', 0, 'L', true, 0, false, false, 0);

    //Close and output PDF document
    //https://tcpdf.org/docs/srcdoc/TCPDF/classes-TCPDF/#method_Output
    //1st param: Name is used for filename when downloading
    //2nd param: 
    //'I' - view in browser with pdf viewer
    //'D' - force download
    //'S' - return the document as a string
    //'F' - saves local file so we could do download link
    ob_clean(); //flushes buffer
    $file = __DIR__ . '/' . $resumeID . '.pdf';
    $pdf->Output($file, 'F'); //actual code
    // $pdf->Output($file, 'I'); //for debugging

    // echo '/CSE442-542/2022-Spring/cse-442r/backend/api/' . $resumeID . '.pdf';         
}
?>