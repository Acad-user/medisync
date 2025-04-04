"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Brain, Stethoscope } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const commonSymptoms = [
  "fever",
  "cough",
  "fatigue",
  "headache",
  "body pain",
  "sore throat",
  "shortness of breath",
  "nausea",
  "diarrhea",
  "loss of taste or smell",
] as const

interface Prediction {
  disease: string
  probability: number
  description: string
  recommendations: string[]
}

export function DiseasePredictor() {
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePrediction = async () => {
    setIsLoading(true)
    try {
      // This is a mock prediction - replace with actual API call
      const mockPrediction: Prediction = {
        disease: "Common Cold",
        probability: 85,
        description: "A viral infection of the upper respiratory tract causing inflammation of the nose and throat.",
        recommendations: [
          "Rest and stay hydrated",
          "Take over-the-counter cold medications",
          "Use saline nasal drops",
          "Gargle with warm salt water",
          "Consult a doctor if symptoms worsen",
        ],
      }
      
      setTimeout(() => {
        setPrediction(mockPrediction)
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error predicting disease:", error)
      setIsLoading(false)
    }
  }

  const handleSymptomToggle = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          Disease Predictor
        </CardTitle>
        <CardDescription>
          Input your symptoms and get an AI-powered prediction of possible conditions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>Basic Information</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Common Symptoms</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {commonSymptoms.map((symptom) => (
                <Button
                  key={symptom}
                  variant={symptoms.includes(symptom) ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => handleSymptomToggle(symptom)}
                >
                  {symptom}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Describe any other symptoms or relevant information..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            onClick={handlePrediction}
            disabled={isLoading || symptoms.length === 0}
          >
            {isLoading ? (
              <>Loading...</>
            ) : (
              <>
                <Stethoscope className="mr-2 h-4 w-4" />
                Get Prediction
              </>
            )}
          </Button>
        </div>

        {prediction && (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Possible Condition: {prediction.disease}</AlertTitle>
              <AlertDescription>
                Confidence: {prediction.probability}%
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h4 className="font-medium">Description</h4>
              <p className="text-sm text-muted-foreground">{prediction.description}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Recommendations</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {prediction.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>

            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important Notice</AlertTitle>
              <AlertDescription>
                This is an AI-powered prediction and should not be considered as a medical diagnosis. 
                Please consult with a healthcare professional for proper medical advice.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 