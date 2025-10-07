import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl: string;
  pdfTitle?: string;
}

const PdfModal: React.FC<PdfModalProps> = ({
  isOpen,
  onClose,
  title,
  pdfUrl,
  pdfTitle = "Privacy Policy"
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      // Restore body scroll
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-hidden"
      style={{ zIndex: 9999 }}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* PDF-like Document */}
          <div className="bg-white w-full min-h-full p-4 sm:p-6 lg:p-8 max-w-full">
            {/* Header */}
            <div className="text-center mb-8">
              {title === "FAQ" ? (
                <>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">FAQ</h1>
                </>
              ) : title === "Terms and Conditions" ? (
                <>
                  {pdfTitle?.includes("Warranty") ? (
                    <>
                      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Terms and conditions</h1>
                      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">OLA ELECTRIC TECHNOLOGIES PRIVATE LIMITED</h2>
                    </>
                  ) : (
                    <>
                      <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 break-words">INSURANCE ON-BOARDING TERMS AND CONDITIONS</h1>
                      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">OLA FINANCIAL SERVICES PRIVATE LIMITED (OFS)</h2>
                      <p className="text-sm text-gray-600">Updated and effective from 1st Apr 2024</p>
                    </>
                  )}
                </>
              ) : (
                <>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">OFS PRIVACY POLICY</h1>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">OLA FINANCIAL SERVICES PRIVATE LIMITED (OFS)</h2>
                  <p className="text-sm text-gray-600">Updated and effective from 7th September, 2021</p>
                </>
              )}
            </div>

            {/* Introduction */}
            <div className="mb-6">
              {title === "Terms and Conditions" ? (
                <>
                  {pdfTitle?.includes("Warranty") ? (
                    <>
                      <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                        OLA ELECTRIC TECHNOLOGIES PRIVATE LIMITED (hereinafter referred to as Company) warrants - that each new vehicle (of the models under coverage) manufactured by the Company shall be free from any defects in both material and workmanship, under normal use and maintenance for the warranty period.
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                        Ola Electric Technologies Private Limited is offering the following warranty plan for your vehicle's battery.
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                        Ola Electric Battery Base Warranty Plan: 3yr/50k Kms (whichever is earlier) - Free
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                        Battery Top Up Plan 1 - 5 yr/60k Kms (whichever is earlier) - priced at INR 3,999/-
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                        Battery Top Up Plan 2 - 8 yr/80k kms (whichever is earlier) - priced at INR 6,999/-
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                        Battery Top Up Plan 3 - 8 yr/100k kms (whichever is earlier) - priced at INR 10,499/-
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                        Battery Top Up Plan 4 - 8 yr/125k kms (whichever is earlier) - priced at INR 14,999/-
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                        These terms and conditions ("User Terms") apply to Your use of the Insurance Facilitation Services on the Platform (defined below). This document is an electronic record in terms of Information Technology Act, 2000 and rules thereunder as applicable and the provisions pertaining to electronic records in various statutes as amended by the Information Technology Act, 2000. This electronic record is generated by a computer system and does not require any physical or digital signatures.
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                        By checking the tick box or by clicking on the "I ACCEPT" button or by using the Insurance Facilitation Services (defined below), or by use of any functionality of the Platform, You are consenting to be bound by these User Terms. PLEASE ENSURE THAT YOU READ AND UNDERSTAND ALL THESE USER TERMS BEFORE YOU USE OR ACCESS THE INSURANCE FACILITATION SERVICES. If You do not accept any of the User Terms, then please do not avail any of the services being provided therein.
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                        YOUR AGREEMENT TO THESE USER TERMS SHALL OPERATE AS A BINDING AGREEMENT BETWEEN YOU AND OFS IN RESPECT OF THE USE OR ACCESS OF THE INSURANCE FACILITATION SERVICES OFFERED ON THE PLATFORM.
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed break-words">
                        Your acceptance of the User Terms shall be deemed to include your acceptance of the OFS Privacy Policy available, and any applicable Insurer (defined below) terms and conditions (together, the "Agreement"). If there is any conflict between these User Terms and any other applicable terms, in relation to the Insurance Facilitation Services, these User Terms shall prevail.
                      </p>
                    </>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                    Ola Financial Services Private Limited (hereinafter referred to as "OFS"/"We"/"Our"/"Us") is firmly committed to the protection and recognizes the importance of privacy, confidentiality and security of Your personal information and values the trust You place in Us. Capitalized terms not defined in this Privacy Policy are defined in the Terms and Conditions of OFS available at OFS T&Cs.
                  </p>
                  <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                    This Privacy Policy describes how We handle, treat, protect, share and otherwise process your personal information provided to us on the Platform and how We use that information in connection with the Insurance Facilitation Services offered by Us.
                  </p>
                  <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                    This Privacy Policy is published in accordance with the provisions of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data of Information) Rules, 2011 under the Information Technology Act, 2000 and other applicable laws that provide rules, regulations and guidelines on access, collection, usage, disclosure, transfer or otherwise processing of personal information and sensitive personal information.
                  </p>
                  <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                    Please read this Privacy Policy carefully to learn more about our information gathering and dissemination practices.
                  </p>
                  <p className="text-sm text-gray-800 leading-relaxed break-words">
                    By visiting the Platform, utilizing the Insurance Facilitation Services, providing Your information and/or accepting the Terms and Conditions, You expressly agree to be bound by this Privacy Policy. This Privacy Policy is incorporated into and subject to the Terms and Conditions, the Insurance Facilitation Service, and any relevant documentation or terms on the Platform.
                  </p>
                </>
              )}
            </div>

            {/* Main Content */}
            {title === "FAQ" ? (
              <>
                {/* FAQ Content */}
                <div className="mb-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">What is the coverage period of the base warranty?</h3>
                    <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                      The comprehensive warranty provides coverage for 3 years or 40,000 kilometers (additional 10,000 kilometers for the battery), whichever is earlier. This warranty helps protect customers from unnecessary costs associated with battery or parts replacement, offering three years of peace of mind regarding the battery and its related components, while also reducing the overall cost of ownership.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">What is covered in the base warranty?</h3>
                    <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                      The comprehensive warranty covers the battery and vehicle components for 3 years or 40,000 kms (additional 10,000 kms for battery), whichever is earlier. Please refer to your standard warranty manual set out in the owner's manual for more details. As part of the base battery warranty, batteries will be replaced for any manufacturing/design defects caused faults or if battery health degrades during the warranty period. Base warranty period is defined as the coverage till 3-yrs or 50,000 kms (whichever is earlier). All retail customers getting delivery of their S1 or booking their S1 starting 14th Nov 2024 will be eligible for this warranty. All models delivered before 14th Feb 2024 will continue to have old warranty terms.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">What does the base warranty cover?</h3>
                    <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                      The company will provide replacement/repair of the battery and associated parts relating to the battery only that are damaged due to manufacturing defects or workmanship, free of cost including the labor charges till such time the offer lasts. The defective parts will be the company's property.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Is the base warranty transferable?</h3>
                    <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                      Yes. In case of the sale of a vehicle to another person, the Base Warranty will be transferred to the new owner.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">How can I claim the base warranty?</h3>
                    <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                      In case of a defect in the battery and associated parts of the battery, bring the vehicle to an OLA authorized service center along with the certificate of warranty emailed to you. If the defective part is covered under the warranty, the center will automatically repair/replace the battery free of charge.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">What is not covered under the base warranty plan?</h3>
                    <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                      Vehicle's non-battery parts come with standard warranty of 3 years or 40,000 kms (whichever earlier). Any natural wear and tear, physical damage, consumables, parts and conditions excluded in manufacturer warranty, customer negligence related damage, modifications/alterations, deletion/defacement/alternation of VIN (Vehicle Identification Number) and BIN (Battery Identification Number), theft, vehicle abuse, accident, flooding, fire, etc. Negligence to charge battery, leading to damage to battery is NOT covered under the warranty plan. The above list is not exhaustive, it is only illustrative. Please refer to the plan Terms and Conditions and the owner's manual for exclusions of the relevant warranty.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Who is eligible to buy top-up warranty (5 year, 60000 kms)?</h3>
                    <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                      In the case of top-up warranty, the warranty period is defined as coverage till 5 years or 60,000 km (whichever is earlier). S1 Pro, S1 Air, S1 X+ (3KWh), S1 X (3KWh, 4KWh) are eligible to purchase the top-up warranty within 12 months from the date of delivery of the vehicle. This is applicable only on the aforementioned vehicles delivered on or after 14 Nov 2024. S1 X (2KWh) is NOT eligible for this policy.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Who is eligible to buy top-up warranty (8 year, 80000 kms)?</h3>
                    <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                      In the case of top-up warranty, the warranty period is defined as coverage till 8 years or 80,000 km (whichever is earlier). S1 Pro, S1 Air, S1 X+ (3KWh), S1 X (3KWh, 4KWh) are eligible to purchase the top-up warranty within 12 months from the date of delivery of the vehicle. This is applicable only on the aforementioned vehicle delivered on or after 14 Nov 2024. S1 X (2KWh) is NOT eligible for this policy.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Who is eligible to buy top-up warranty (8 year, 100000 km)?</h3>
                    <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                      In the case of top-up warranty, the warranty period is defined as coverage till 8 years or 100,000 km (whichever is earlier). S1 Pro, S1 Air, S1 X+ (3KWh), S1 X (3KWh, 4KWh) are eligible to purchase the top-up warranty within 12 months from the date of delivery of the vehicle. This is applicable only on the aforementioned vehicle delivered on or after 14 Nov 2024. S1 X (2KWh) is NOT eligible for this policy.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Who is eligible to buy top-up warranty (8 year, 125000 km)?</h3>
                    <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                      In the case of top-up warranty, the warranty period is defined as coverage till 8 years or 125,000 km (whichever is earlier). S1 Pro, S1 Air, S1 X+ (3KWh), S1 X (3KWh, 4KWh) are eligible to purchase the top-up warranty within 12 months from the date of delivery of the vehicle. This is applicable only on the aforementioned vehicle delivered on or after 14 Nov 2024. S1 X (2KWh) is NOT eligible for this policy.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">What is covered in the top-up warranty (5 year, 60000 km; 8 year, 80000 km; 8 Year, 100,000 km or 8 year 125,000 km)?</h3>
                    <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                      The company will provide replacement/repair of the battery and associated parts of the battery only that are damaged due to manufacturing defects or workmanship, free of cost including the labor charges till the time the offer lasts. The defective parts will be the company's property. This also ensures that the battery is replaced in case the health of the battery falls below 70%.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Are the top-up warranties transferable?</h3>
                    <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                      Yes. In case of sale of the vehicle to another person, both the top-up warranties will be transferred to the new owner.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">How can I access my warranty policy document?</h3>
                    <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                      Additional battery warranty certificate is an additional document that will be emailed to you on your purchase of the vehicle. Standard warranty is available in the owner's manual.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">What happens when my battery is replaced under warranty?</h3>
                    <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                      Warranty policy will continue to be in-force, per the original validity conditions (3 years or 50,000 kms in the Base battery warranty period from the date of delivery or as per top-up warranty period, i.e., (5 year, 60000 km) or (8 year, 80000 km) or (8 Year, 100000 km) or (8 year 125,000 km) if purchased by the customer.
                    </p>
                  </div>
                </div>
              </>
            ) : title === "Terms and Conditions" ? (
              <>
                {pdfTitle?.includes("Warranty") ? (
                  <>
                    {/* Warranty Terms Content */}
                    <div className="mb-6">
                      <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                        Please note: Battery Top Up Plan 1 to Plan 4, shall be collectively referred to as - Top Up Plans.
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                        The Top Up Plans are available on all models of the Ola vehicle except S1X 2Kwh, unless notified otherwise by the Company.
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                        For each of the above Top Up Plans, Ola Electric Technologies Private Limited reserves the right to change any of the terms and conditions of these warranty terms at any time. We will provide notice of any material changes by posting an announcement on the official web-site of Ola Electric. You may review these terms regularly to ensure that You are aware of any changes made by us. The continued use of our Website / Services by You, after changes are posted, means that You agree to be legally bound by these Terms and Conditions as updated and/or amended. In the case of any violation of these Terms and Conditions or any additional terms posted on Our Website, we reserve the right to seek all remedies available by law and in equity for any such violations.
                      </p>
                    </div>

                    {/* Warranty Terms and Conditions */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">WARRANTY TERMS AND CONDITIONS</h3>
                      <p className="text-sm text-gray-800 leading-relaxed mb-4 break-words">
                        OLA ELECTRIC TECHNOLOGIES PRIVATE LIMITED (COMPANY) warrants that each newly manufactured electric two-wheeler by the Company shall be free from any defects in both material and workmanship, under normal use and maintenance, subject to the following terms and conditions:
                      </p>
                      
                      <div className="mb-4">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">Section 1: Base Warranty Period on Battery:</h4>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          1. The warranty on the battery shall exist for a period of 36 months from the date of delivery of the vehicle or 50,000 kms whichever is earlier irrespective of Kilometers driven.
                        </p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">Section 2: Warranty Period on Vehicle Components:</h4>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          1. All vehicle components except the battery are covered under this Vehicle Components Warranty for a period of 36 months from the date of delivery of the vehicle or 40,000 kms, whichever occurs early.
                        </p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">Section 3: What is covered under Warranty (both vehicle and battery):</h4>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          Warranty is transferable to the subsequent owner for the remaining warranty period and is applicable only in India.
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          The Company's obligation is limited to repairing or replacing, free of cost, those parts of the vehicle, which upon examination by the Company may acknowledge to be defective in manufacturing or workmanship within the warranty period stipulated above, and in such cases, the Company's decision either to repair or replace the affected part will be final. Such defective parts that have been replaced shall become the property of the Company.
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          All labor costs with respect to the above replacement or repair during the warranty period shall be borne by the Company.
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          Battery and Parts repaired or replaced under this warranty are covered only for the remainder of the original warranty period.
                        </p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">Section 4: What is not covered under Warranty:</h4>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          This warranty shall not apply to: Any natural wear and tear and aging of parts of the vehicle, like the Brake pads, brake discs, bearings, tyres, bushes, rubber parts, belt, grommets and seals.
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          Consumables like brake oil, fasteners, grease and dust seal Normal maintenance services, including without limitation, cleaning and polishing, etc.
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          Failure to charge the battery for an extended period may result in degradation of the battery's health or performance &, potentially, irreversible damage. such damage may necessitate the need for a battery replacement & is not covered under the warranty.
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          Replacement of parts as a result of normal wear and tear
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          Negligence of carrying out proper maintenance as written in the Owner's Manual and Service Manual Misuse, abuse, accidents, theft, flooding, fire or taking part in motor races or competitions use of improper or non-genuine oils and lubricants Vehicles used with sidecars not manufactured / supplied by the Company Use of parts other than Company's genuine parts Any device and/or accessories not supplied by the Company with the vehicle Modifications, alterations, tampering or improper repairs done at any unauthorized service points Control Units or software used in vehicle which are not designed or approved by the company Paint scratches, dents or similar paint or body damage on the vehicle not due to the Company Vehicles on which motor number or chassis number is deleted, defaced or altered Tyres originally equipped on the Vehicle are warranted for directly by the respective manufacturers and not by the Company.
                        </p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">Section 5: Declaration</h4>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          This Warranty should be considered as a permanent part of the vehicle and should remain with the vehicle when sold or transferred to a new owner
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          All information, illustrations, photographs and specifications contained in the Owner's Manual are based on the latest product information available at the time of its publication. The Company may, however, incorporate modifications or improvements on its vehicles at any time, without notice and therefore, in such events, it is possible that some parts of the Owner's Manual may not apply to your vehicle
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          prior written permission of the Company is required for quoting, copying or reproducing any part or in full of the Owner's Manual
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          Accessories shown in the picture may not be part of the standard equipment
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          The Company shall not be liable for any delay in servicing due to reasons beyond the control of the Company Except for the limited warranties described herein, the Company does not provide any other warranty, whether express, implied, statutory, or otherwise. The limited warranties contained in this booklet are issued in Bengaluru, and any claim relating to or arising out of the warranty terms herein shall be subject to the courts at Bengaluru, which shall have the exclusive jurisdiction to entertain and adjudicate the said claims.
                        </p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">Section 6: Owner's Responsibility</h4>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          Please take proper care, proper use and maintenance of the vehicle in accordance with the instructions provided in the Owner's Manual. If the vehicle is subjected to severe usage conditions, such as operating in extremely dusty, rough or heavy city traffic during hot weather or during the monsoons, usage of vehicles with underinflated wheels, maintenance of the vehicle may have to be done more often.
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          Maintenance service records will be maintained by the Company and can be made available to the Customer on request
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          In order to maintain the validity of this Warranty on the vehicle, the vehicle must be serviced by the Company Authorized workshop in accordance to the Owner's Manual
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Insurance Terms Content - Simplified */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">1. DEFINITIONS</h3>
                      <div className="mb-4">
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          "Insurer(s)" means an entity/insurance company who has permitted OFS as a Corporate Agent for Insurance solicitation.
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          "Insurance Facilitation Services" means provisioning of insurance facilitation services through the Platform.
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          "Platform" means the mobile application, website, or any other online platform owned and operated by Ola Financial Services Private Limited.
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">2. ELIGIBILITY</h3>
                      <div className="mb-4">
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          OFS is a registered Corporate Agent (CA Registration No: CA0682) with IRDA and provides Insurance Facilitation Services.
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          You confirm that you are an individual, adult, over 18 years of age, and all information provided is true and accurate.
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">3. SCOPE OF SERVICES</h3>
                      <div className="mb-4">
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          The Insurance Facilitation Services are available and valid only for use in India.
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          Your application for Insurance is solely determined by the Insurer.
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">13. GRIEVANCE</h3>
                      <div className="mb-4">
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          For any concerns or grievances, contact: insurance.support@olacabs.com or 080-69794500
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                          Grievance Officer: Mr. Rohit Prasad, Ola Financial Services Private Limited
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                {/* Privacy Policy Content */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">1. Collection of Personal Information</h3>
                  <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                    When You visit the Platform to avail the Insurance Facilitation Services, We will collect Your personal information including name, phone number, email, address, and other details as required.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">2. Consent and Use</h3>
                  <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                    By visiting the Platform and providing Your information, you consent to the collection, use, disclosure and processing of Your information in accordance with this Privacy Policy.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">3. Sharing and Disclosure</h3>
                  <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                    We may share Your personal information with our corporate entities, affiliates, Insurers, and other third parties as required for providing services.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">4. Data Retention</h3>
                  <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                    We retain Your personal information in accordance with applicable laws for the period required for the purposes for which it was collected.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">5. Security</h3>
                  <p className="text-sm text-gray-800 leading-relaxed mb-3 break-words">
                    OFS adopts reasonable security practices and procedures to protect from unauthorised access, breach, damage, or disclosure of information.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">6. Grievance</h3>
                  <p className="text-sm text-gray-800 leading-relaxed break-words">
                    For any concerns or grievances, contact: support@olamoney.com or 080-37101888
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 rounded-b-2xl">
          <div className="flex items-center justify-end">
            <button
              onClick={handleClose}
              className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {pdfTitle?.includes("Warranty") && !pdfTitle?.includes("FAQ") ? "Okay" : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfModal;
