'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { VerificationStatus } from '@/components/VerificationStatus';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast, { Toaster } from 'react-hot-toast';
import { useWalletStore } from '@/lib/stores/wallet';
import { useBalancesStore } from '@/lib/stores/balances';
import { client } from 'chain';


export default function VerifyPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your verification...');
  const wallet = useWalletStore();
  const [destAddress,setDestAddress] = useState("");
  const balances1 = useBalancesStore();

 
  const verifyOwner = async () => {
    console.log("verifying owner", destAddress)
    if (!userId) {
      setVerificationStatus('error');
      setMessage('No user ID provided');
      return;
    }

    try {
      const response = await fetch('http://localhost:8050/api/verify-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }
      const owner = await balances1.checkIfUserOwnsNFT(client,wallet?.wallet as string);
      setVerificationStatus('success');
      toast('Your NFT ownership has been verified successfully!');
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      toast('Failed to verify NFT ownership. Please try again.');
    }
    
    // if(owner && destAddress){
    //   toast("verified")
    // }
    // else{
    //  toast("Owner is not verified")
    // }
  }
//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
//             NFT Verification
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Please wait while we verify your NFT ownership
//           </p>
//         </div>

//         <div className="mt-8">
//           {/* <VerificationStatus
//             type={verificationStatus}
//             message={message}
//           >
//             {verificationStatus === 'loading' && 'Verifying NFT Ownership'}
//             {verificationStatus === 'success' && 'Verification Complete'}
//             {verificationStatus === 'error' && 'Verification Failed'}
//           </VerificationStatus> */}
//         </div>
//       </div>
//     </div>
//   );
  return <div className="min-h-screen bg-gray-50 p-4">
  <div className="max-w-7xl mx-auto space-y-6">
    {/* Admin Header */}
    <Card className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-zinc-500">Manage wallet verifications and accounts</p>
        </div>
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        //   loading={loading}
        //   onClick={onConnectWallet}
        >
          {wallet.wallet ? `Connected` : 'Connect Admin Wallet'}
        </Button>
        <input
          type="text"
          placeholder="Enter wallet address"
          value={destAddress}
          onChange={(e) => setDestAddress(e.target.value)}
        />
                <Button
         size={'lg'}
         type="submit"
         className="mt-6 w-full"
        //  loading={loading}
         onClick={verifyOwner}
           >Verify</Button>
      </div>
    </Card>

    {/* Verification Table
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Pending Verifications</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Wallet Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Requested</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingVerifications.map((verification) => (
            <TableRow key={verification.id}>
              <TableCell className="font-mono">{verification.address}</TableCell>
              <TableCell>
                <Badge variant={
                  verification.status === 'verified' ? 'success' :
                  verification.status === 'rejected' ? 'destructive' :
                  'default'
                }>
                  {verification.status}
                </Badge>
              </TableCell>
              <TableCell>{verification.requestedAt}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-green-50 text-green-700 hover:bg-green-100"
                    loading={loading}
                    onClick={() => verifyWallet(verification.id)}
                    disabled={verification.status !== 'pending'}
                  >
                    Verify
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-red-50 text-red-700 hover:bg-red-100"
                    loading={loading}
                    onClick={() => rejectWallet(verification.id)}
                    disabled={verification.status !== 'pending'}
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card> */}

    <Toaster />
  </div>
</div>
}