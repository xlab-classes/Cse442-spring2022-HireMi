<?php

require_once __DIR__ . '/../vendor/tecnickcom/tcpdf/examples/tcpdf_include.php';

const FONTS = array("times", "timesb", "timesi", "timesbi",
 "helvetica", "helveticab", "helveticai", "helveticabi",
 "courier", "courierb", "courieri", "courierbi",
 "symbol", "zapfdingbats");


$data = array(
    "resume_id" => 1,
    "elements" => array(
        array(
            "type" => "text",
            "offset-x" => 100,
            "offset-y" => 100,
            "width" => 100,
            "height" => 100,
            "z-index" => 1,
            "content" => "HelloWorld",
            "prop" => array(
                "font-type" => "arial",
                "font-size" => 12
            )
        )
    ),
    "share" => 1
);


generatePDF($data);

function generatePDF($data){


    $resumeID = $data["resume_id"];
    $elements = $data["elements"];
    $share = $data["share"];
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
            $pdf->SetXY($x, $y);
            //https://tcpdf.org/docs/srcdoc/TCPDF/classes-TCPDF/#method_Write
            $pdf->Write(0, $content, '', 0, 'L', true, 0, false, false, 0);
        }

    }


    $pdf->Write(0, $text, '', 0, 'L', true, 0, false, false, 0);

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
    // $pdf->Output($file, 'F'); //actual code
    $pdf->Output($file, 'I'); //for debugging

    // echo '/CSE442-542/2022-Spring/cse-442r/backend/api/' . $resumeID . '.pdf'            
}
?>