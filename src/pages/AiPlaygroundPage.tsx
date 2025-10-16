import React from "react";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { api } from "../lib/api";

export default function AiPlaygroundPage() {
  const { token } = useAuth();
  const [productName, setproductName] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFutureInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setproductName(e.target.value);
  };

  const handleGeneratePlan = async () => {
    console.log(productName);
    setLoading(true);
    if (!productName.trim()) {
      alert("Please enter a product name.");
      return;
    }
    try {
      const response = await api.checkAffordability(
        { productName },
        token as string
      );
      setResult(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1>Welcome to AiPlaygroundPage</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card mt-5 shadow">
            <div className="card-body d-flex flex-column gap-3">
              <h5 className="card-title">Please enter your future goals</h5>
              <p className="card-text">
                We will use this to generate a plan for you
              </p>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your future goals"
                value={productName}
                onChange={handleFutureInputChange}
              ></input>
              <button className="btn btn-primary" onClick={handleGeneratePlan}>
                {loading ? "Generating..." : "Check Affordability"}
                {loading ? (
                  <span className="spinner-grow spinner-grow-sm" role="status"></span>
                ) : null}
              </button>
            </div>
            {result ? (
              <div className="card-body">
                <h5 className="card-title">Result</h5>
                <p className="card-text ai-output-text">
                  {result.productDetails.aiOutput.replace(/\*/g, '')}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
